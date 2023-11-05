export type GenericObject = { [key: string]: any };

export interface ModelMetadata {
    name: string
    description: string
    layers: GenericObject[]
}