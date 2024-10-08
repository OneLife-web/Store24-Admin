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
  productId: productData;
}

export interface Settings {
  banner: IBannerInput;
  promotion: IPromotionInput;
}

export interface CreateRequestBody {
  bannerTitle: string;
  bannerLink: string;
  productId: string;
}

interface UpdateSettingsPayload {
  bannerTitle: string;
  bannerLink: string;
  productId: string;
}

export interface UpdateRequestBody {
  bannerTitle: string;
  bannerLink: string;
  productId: string;
}

export interface productData {
  _id?: string;
  images: string[];
  title: string;
  price: number | undefined;
  features: string[];
  whyNeedThis: {
    title: string;
    content: string;
  }[];
  characteristics: {
    title: string;
    content: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export interface updateData {
  _id?: string;
  images: string[];
  title: string;
  price: number | undefined;
  features: string[];
  whyNeedThis: {
    title: string;
    content: string;
  }[];
  characteristics: {
    title: string;
    content: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export interface crumbsType {
  title: string;
  link: string;
}
