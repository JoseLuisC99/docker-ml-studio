import os.path
import subprocess
from typing import List, Optional, Tuple, Literal, Dict

import fsspec
import pytorch_lightning as pl
import torch
import torch.jit
import torch.nn as nn
from torchvision.models.resnet import BasicBlock, ResNet
from torchmetrics import Accuracy
from collections import OrderedDict


class BaseModel(pl.LightningModule):
    def __init__(
        self, layer_signatures: List[Dict[str, str]], task: Literal['binary', 'multiclass', 'multilabel'],
        lr: float, loss_fn: str, optimizer: str,
        num_classes: Optional[int]=None, num_labels: Optional[int]=None,
    ) -> None:
        super().__init__()

        layers = []
        layer_idx = 0
        for layer_signature in layer_signatures:
            if layer_signature['type'] == 'linear':
                layers.append((f'linear_{layer_idx}', nn.Linear(
                    int(layer_signature['in']), int(layer_signature['out'])
                )))
            elif layer_signature['type'] == 'conv2d':
                layers.append((f'conv2d_{layer_idx}', nn.Conv2d(
                    int(layer_signature['in']), int(layer_signature['out']),
                    int(layer_signature['kernel']), int(layer_signature['stride']),
                    int(layer_signature['padding'])
                )))
            elif layer_signature['type'] == 'maxpool2d':
                layers.append((f'maxpool2d_{layer_idx}', nn.MaxPool2d(
                    int(layer_signature['kernel']), int(layer_signature['stride']),
                    int(layer_signature['padding'])
                )))
            elif layer_signature['type'] == 'avgpool2d':
                layers.append((f'avgpool2d_{layer_idx}', nn.AvgPool2d(
                    int(layer_signature['kernel']), int(layer_signature['stride']),
                    int(layer_signature['padding'])
                )))
            elif layer_signature['type'] == 'batchnorm2d':
                layers.append((f'batchnorm2d_{layer_idx}', nn.BatchNorm2d(
                    int(layer_signature['num_feat'])
                )))
            elif layer_signature['type'] == 'dropout':
                layers.append((f'dropout_{layer_idx}', nn.Dropout(
                    float(layer_signature['p'])
                )))
            elif layer_signature['type'] == 'embedding':
                layers.append((f'embedding_{layer_idx}', nn.Embedding(
                    int(layer_signature['in']), int(layer_signature['out']),
                )))
            elif layer_signature['type'] == 'rnn':
                layers.append((f'rnn_{layer_idx}', nn.RNN(
                    int(layer_signature['in']), int(layer_signature['hidden']),
                )))
            elif layer_signature['type'] == 'lstm':
                layers.append((f'lstm_{layer_idx}', nn.LSTM(
                    int(layer_signature['in']), int(layer_signature['hidden']),
                )))
            elif layer_signature['type'] == 'gru':
                layers.append((f'gru_{layer_idx}', nn.GRU(
                    int(layer_signature['in']), int(layer_signature['hidden']),
                )))
            elif layer_signature['type'] == 'resnet':
                layers.append((f'resnet_{layer_idx}', ResNet(BasicBlock, [1, 1, 1, 1])))
            elif layer_signature['type'] == 'relu':
                layers.append((f'relu_{layer_idx}', nn.ReLU()))
            elif layer_signature['type'] == 'sigmoid':
                layers.append((f'sigmoid_{layer_idx}', nn.Sigmoid()))
            elif layer_signature['type'] == 'tanh':
                layers.append((f'tanh_{layer_idx}', nn.Tanh()))
            else:
                raise Exception(f"Sorry, I can't work with layers of type {layer_signature['type']}")
            layer_idx += 1

        self.model = nn.Sequential(OrderedDict(layers))

        self.train_acc = Accuracy(task=task, num_classes=num_classes, num_labels=num_labels)
        self.val_acc = Accuracy(task=task, num_classes=num_classes, num_labels=num_labels)

        self.lr = lr
        self.loss_fn = self.configure_loss(loss_fn)
        self.optimizer = optimizer

    def forward(self, X: torch.Tensor) -> torch.Tensor:
        return self.model(X)


    def training_step(self, batch: Tuple[torch.Tensor, torch.Tensor], batch_idx: int) -> torch.Tensor:
        return self._step("train", self.train_acc, batch, batch_idx)


    def validation_step(self, val_batch: Tuple[torch.Tensor, torch.Tensor], batch_idx: int) -> torch.Tensor:
        return self._step("val", self.val_acc, val_batch, batch_idx)


    def _step(
        self, step_name: str, acc_metric: Accuracy, batch: Tuple[torch.Tensor, torch.Tensor], batch_idx: int
    ) -> torch.Tensor:
        X, y = batch
        y_pred = self(X)

        loss = self.loss_fn(y_pred, y)
        self.log(f"{step_name}_loss", loss)
        acc_metric(y_pred, y)
        self.log(f"{step_name}_acc", acc_metric.compute())
        return loss

    
    def configure_loss(self, loss_name: str):
        loss_fns = {
            'mse': nn.MSELoss,
            'cross_entropy': nn.CrossEntropyLoss,
            'bce': nn.BCELoss
        }
        return loss_fns[loss_name]()


    def configure_optimizers(self):
        optimizers = {
            'sgd': torch.optim.SGD,
            'adam': torch.optim.Adam,
            'adamw': torch.optim.AdamW,
        }
        return optimizers[self.optimizer](self.parameters(), lr=self.lr)


def export_inference_model(model: BaseModel, out_path: str, tmpdir: str) -> None:
    print("exporting inference model")
    jit_path = os.path.join(tmpdir, "model_jit.pt")
    jitted = torch.jit.script(model)
    print(f"saving JIT model to {jit_path}")
    torch.jit.save(jitted, jit_path)

    mar_path = os.path.join(tmpdir, "model.mar")
    print(f"creating model archive at {mar_path}")
    subprocess.run(
        [
            "torch-model-archiver",
            "--model-name",
            "model",
            "--handler",
            "image_classifier",
            "--version",
            "1",
            "--serialized-file",
            jit_path,
            "--export-path",
            tmpdir,
        ],
        check=True,
    )

    remote_path = os.path.join(out_path, "model.mar")
    print(f"uploading to {remote_path}")
    fs, _, rpaths = fsspec.get_fs_token_paths(remote_path)
    assert len(rpaths) == 1, "must have single path"
    fs.put(mar_path, rpaths[0])
