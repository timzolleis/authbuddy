export interface RSOUserInfo {
    country: string;
    sub: string;
    email_verified: boolean;
    player_plocale: any;
    country_at: number;
    pw: Pw;
    phone_number_verified: boolean;
    account_verified: boolean;
    ppid: any;
    player_locale: string;
    acct: Acct;
    age: number;
    jti: string;
    affinity: Affinity;
}

interface Pw {
    cng_at: number;
    reset: boolean;
    must_reset: boolean;
}

interface Acct {
    type: number;
    state: string;
    adm: boolean;
    game_name: string;
    tag_line: string;
    created_at: number;
}

interface Affinity {
    pp: string;
}
