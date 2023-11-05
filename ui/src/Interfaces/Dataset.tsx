export enum DatasetType{ Unknown, CSV, Image, Folder }

export const datasetTypeName = (type: DatasetType) => {
    switch (type) {
        case DatasetType.CSV:
            return 'CSV dataset'
        case DatasetType.Image:
            return 'Image dataset'
        case DatasetType.Folder:
            return 'Folder dataset'
    }
    return ''
}

export interface PreprocessingAction {
    field: string
    action: string
}

export interface DatasetMetadata {
    name: string
    type: DatasetType
    path: string
    description?: string
    file?: File
    preprocessing: PreprocessingAction[]
    valSplit: number
}