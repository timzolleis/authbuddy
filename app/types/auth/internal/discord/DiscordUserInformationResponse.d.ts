export interface DiscordUserInformationResponse {
    id: string;
    username: string;
    discriminator: string;
    avatar: string;
    flags: number;
    banner: string;
    accent_color: number;
    premium_type: number;
    public_flags: number;
}
