import argparse
import os
import sys
import tempfile
from typing import List, Dict
import json

import pytorch_lightning as pl
import torch
from pytorch_lightning.loggers import CSVLogger

from BaseModel import BaseModel, export_inference_model
from ImageDataLoader import ImageDataLoader
from torchvision.transforms import v2

sys.path.append(".")

def load_model_signature(filepath: str) -> Dict:
    with open(filepath, 'r') as f:
        return json.load(f)

def parse_args(argv: List[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="pytorch lightning trainer")
    parser.add_argument(
        "--model", type=str, help="model file definition"
    )
    parser.add_argument(
        "--epochs", type=int, default=3, help="number of epochs to train"
    )
    parser.add_argument("--lr", type=float, default=0.0001, help="learning rate")
    parser.add_argument(
        "--batch_size", type=int, default=32, help="batch size to use for training"
    )
    parser.add_argument(
        "--data_path",
        type=str,
        help="path to load the training data from",
    )
    parser.add_argument(
        "--output_path",
        type=str,
        help="path to place checkpoints and model outputs, if not specified, checkpoints are not saved",
    )
    parser.add_argument(
        "--log_path",
        type=str,
        help="path to place the tensorboard logs",
        default="/tmp",
    )
    parser.add_argument(
        "--optimizer", type=str, choices=['sgd', 'adam', 'adamw'], help="optimizer to use for training"
    )
    parser.add_argument(
        "--loss", type=str, choices=['mse', 'cross_entropy', 'bce'], help="loss function to use for training"
    )
    parser.add_argument(
        '--task', type=str, choices=['binary', 'multiclass', 'multilabel'], help='type of ML experiment'
    )
    return parser.parse_args(argv)


def main(argv: List[str]) -> None:
    with tempfile.TemporaryDirectory() as tmpdir:
        args = parse_args(argv)

        model_signature = load_model_signature(args.model)

        transforms = v2.Compose([
            v2.ToImage(),
            v2.ToDtype(torch.float32, scale=True),
            v2.RandomResizedCrop(size=(224, 224), antialias=True) # Optional
        ])
        data = ImageDataLoader(args.data_path, transforms=transforms, batch_size=args.batch_size)

        # Init our model
        model = BaseModel(
            model_signature['layers'],
            args.task, num_classes=data.num_classes, num_labels=data.num_classes, 
            lr=args.lr, loss_fn=args.loss, optimizer=args.optimizer)
        print(model)

        logger = CSVLogger(args.log_path, name="training_logger")

        trainer = pl.Trainer(
            num_nodes=int(os.environ.get("GROUP_WORLD_SIZE", 1)),
            accelerator="gpu" if torch.cuda.is_available() else "cpu",
            devices=int(os.environ.get("LOCAL_WORLD_SIZE", 1)),
            strategy="auto",
            logger=logger,
            max_epochs=args.epochs,
            callbacks=[],
            profiler="simple",
        )

        trainer.fit(model, data)
        print(
            f"train acc: {model.train_acc.compute()}, val acc: {model.val_acc.compute()}"
        )

        rank = int(os.environ.get("RANK", 0))
        if rank == 0:
            export_inference_model(model, args.output_path, tmpdir)


if __name__ == "__main__":
    main(sys.argv[1:])