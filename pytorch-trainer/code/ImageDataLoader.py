import pytorch_lightning as pl
from torchvision.datasets import ImageFolder
from torch.utils.data import DataLoader, random_split

class ImageDataLoader(pl.LightningDataModule):
    def __init__(self, data_dir: str, transforms, batch_size: int = 32):
        super().__init__()
        self.data_dir = data_dir
        self.batch_size = batch_size
        self.dataset = ImageFolder(self.data_dir, transform=transforms)
        self.num_classes = len(self.dataset.classes)
    
    def setup(self, stage: str):
        train_dataset, val_dataset = random_split(self.dataset, [0.8, 0.2])
        self.train_data = train_dataset
        self.val_data = val_dataset
    
    def train_dataloader(self):
        return DataLoader(self.train_data, batch_size=self.batch_size)

    def val_dataloader(self):
        return DataLoader(self.val_data, batch_size=self.batch_size)

    def test_dataloader(self):
        return DataLoader(self.val_data, batch_size=self.batch_size)

    def teardown(self, stage: str):
        pass