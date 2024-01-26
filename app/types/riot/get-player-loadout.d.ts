export interface PlayerLoadout {
    Subject: string;
    Version: number;
    Guns: Gun[];
    Sprays: Spray[];
    Identity: Identity;
    Incognito: boolean;
}

interface Gun {
    ID: string;
    SkinID: string;
    SkinLevelID: string;
    ChromaID: string;
    Attachments: any[];
    CharmInstanceID?: string;
    CharmID?: string;
    CharmLevelID?: string;
}

interface Spray {
    EquipSlotID: string;
    SprayID: string;
    SprayLevelID: any;
}

interface Identity {
    PlayerCardID: string;
    PlayerTitleID: string;
    AccountLevel: number;
    PreferredLevelBorderID: string;
    HideAccountLevel: boolean;
}
