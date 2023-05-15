export interface UnsplashImage {
    id: string;
    slug: string;
    created_at: string;
    updated_at: string;
    promoted_at: string;
    width: number;
    height: number;
    color: string;
    blur_hash: string;
    description: any;
    alt_description: string;
    urls: Urls;
    links: Links;
    likes: number;
    liked_by_user: boolean;
    current_user_collections: UserCollection[];
    sponsorship: any;
    topic_submissions: TopicSubmissions;
    user: User;
    exif: Exif;
    location: Location;
    meta: Meta;
    public_domain: boolean;
    tags: Tag[];
    tags_preview: TagsPreview[];
    views: number;
    downloads: number;
    topics: any[];
}

interface UserCollection {
    id: number;
    title: string;
    published_at: string;
    last_collected_at: string;
    updated_at: string;
    cover_photo: null;
    user: null;
}

interface Urls {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
    small_s3: string;
}

interface Links {
    self: string;
    html: string;
    download: string;
    download_location: string;
}

interface User {
    id: string;
    updated_at: string;
    username: string;
    name: string;
    first_name: string;
    last_name: string;
    twitter_username?: string;
    portfolio_url?: string;
    bio?: string;
    location?: string;
    links: UserLinks;
    profile_image: ProfileImage;
    instagram_username: any;
    total_collections: number;
    total_likes: number;
    total_photos: number;
    accepted_tos: boolean;
    for_hire: boolean;
    social: Social;
}

interface UserLinks {
    self: string;
    html: string;
    photos: string;
    likes: string;
    portfolio: string;
    following: string;
    followers: string;
}

interface ProfileImage {
    small: string;
    medium: string;
    large: string;
}

interface Social {
    instagram_username: any;
    portfolio_url: any;
    twitter_username: any;
    paypal_email: any;
}

interface Exif {
    make: any;
    model: any;
    name: any;
    exposure_time: any;
    aperture: any;
    focal_length: any;
    iso: any;
}

interface Location {
    name: any;
    city: any;
    country: any;
    position: Position;
}

interface Position {
    latitude: any;
    longitude: any;
}

interface Meta {
    index: boolean;
}

interface Tag {
    type: string;
    title: string;
    source?: Source;
}

interface Source {
    ancestry: Ancestry;
    title: string;
    subtitle: string;
    description: string;
    meta_title: string;
    meta_description: string;
    cover_photo: CoverPhoto;
}

interface Ancestry {
    type: Type;
    category: Category;
    subcategory?: Subcategory;
}

interface Type {
    slug: string;
    pretty_slug: string;
}

interface Category {
    slug: string;
    pretty_slug: string;
}

interface Subcategory {
    slug: string;
    pretty_slug: string;
}

interface CoverPhoto {
    id: string;
    slug: string;
    created_at: string;
    updated_at: string;
    promoted_at?: string;
    width: number;
    height: number;
    color: string;
    blur_hash: string;
    description?: string;
    alt_description: string;
    urls: CoverPhotoUrls;
    links: Links;
    likes: number;
    liked_by_user: boolean;
    current_user_collections: any[];
    sponsorship: any;
    topic_submissions: TopicSubmissions;
    premium: boolean;
    plus: boolean;
    user: User;
}

interface CoverPhotoUrls {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
    small_s3: string;
}

interface TopicSubmissions {
    'current-events'?: CurrentEvents;
    people?: People;
    health?: Health;
    athletics?: Athletics;
}

interface CurrentEvents {
    status: string;
    approved_on: string;
}

interface People {
    status: string;
    approved_on: string;
}

interface Health {
    status: string;
    approved_on: string;
}

interface Athletics {
    status: string;
    approved_on: string;
}

interface TagsPreview {
    type: string;
    title: string;
    source?: Source;
}
