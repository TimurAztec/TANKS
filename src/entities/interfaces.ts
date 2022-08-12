type SkinOptions = {
    assetName?: string
    scaleX?: number
    scaleY?: number
    numberOfFrames?: number
}

interface IEntity {
    clone(): IEntity;
}

export {IEntity, SkinOptions}