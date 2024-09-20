export interface InputProps {
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  placeholder?: string;
  icon?: React.ReactNode;
}

export interface IBannerInput {
  title: string;
  link: string;
}

export interface IPromotionInput {
  title: string;
  link: string;
  imageUrl: string;
  features: string[];
}

export interface Settings {
  banner: IBannerInput;
  promotion: IPromotionInput;
}

export interface CreateRequestBody {
  bannerTitle: string;
  bannerLink: string;
  promotionTitle: string;
  promotionLink: string;
  promotionImageUrl: string;
  promotionFeatures: string[];
}

interface UpdateSettingsPayload {
  bannerTitle: string;
  bannerLink: string;
  promotionTitle: string;
  promotionLink: string;
  promotionImageUrl: string;
  promotionFeatures: string[];
}

export interface UpdateRequestBody {
  bannerId: string;
  bannerTitle: string;
  bannerLink: string;
  promotionId: string;
  promotionTitle: string;
  promotionLink: string;
  promotionImageUrl: string;
  promotionFeatures: string[];
}
