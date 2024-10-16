export interface InputProps {
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  placeholder?: string;
  icon?: React.ReactNode;
}

export interface CartItem {
  _id?: string;
  productId: string;
  productImage: string;
  name: string;
  price: number;
  quantity: number;
  color?: string;
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

export interface ReviewProps {
  _id?: string;
  name: string;
  comment: string;
  rating: number;
  country?: string;
  date: string;
}

export interface ImageProps {
  url: string;
  caption?: string;
}

export interface productData {
  _id?: string;
  images: ImageProps[];
  descriptionImages?: string[];
  title: string;
  quantitySold?: string;
  description?: string;
  price: number | undefined;
  discountPrice?: number | undefined;
  features: string[];
  colors?: string[];
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
  reviews?: ReviewProps[];
}

export interface updateData {
  _id?: string;
  images: ImageProps[];
  descriptionImages?: string[];
  title: string;
  quantitySold?: string;
  description?: string;
  price: number | undefined;
  discountPrice?: number | undefined;
  features: string[];
  colors?: string[];
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
  reviews?: ReviewProps[];
}

export interface crumbsType {
  title: string;
  link: string;
}
