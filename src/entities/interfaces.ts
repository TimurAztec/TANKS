type SkinOptions = {
    assetName?: string
    numberOfFrames?: number
    scaleX?: number
    scaleY?: number
    hitboxWidth?: number
    hitboxHeight?: number
}

interface IEntity {
    clone(): IEntity;
}

export {IEntity, SkinOptions}