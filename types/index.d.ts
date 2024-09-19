export interface InputProps {
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  placeholder?: string;
}

export interface IBannerInput {
  title: string;
  link: string;
}

export interface IPromotionInput {
  title: string;
  link: string;
  imageUrl: string;
}

export interface CreateRequestBody {
  bannerTitle: string;
  bannerLink: string;
  promotionTitle: string;
  promotionLink: string;
  promotionImageUrl: string;
}

export interface UpdateRequestBody {
  bannerId: string;
  bannerTitle: string;
  bannerLink: string;
  promotionId: string;
  promotionTitle: string;
  promotionLink: string;
  promotionImageUrl: string;
}

