import { Document } from "mongoose";

export interface IGeneralSettings extends Document {
  logo?: string;
  favicon?: string;

  mobileNo?: string;
  alternateMobileNo?: string;

  mail?: string;
  alternateEmail?: string;

  address?: string;
  addressIframe?: string;
  workingHrs?: string;

  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  youtube?: string;
  whatsApp?: string;

  homeIntroVideo?: string;
  homeSlidingTitle?: string;
  footerCopyrights?: string;

  username?: string;
  password?: string;

  createdAt: Date;
  updatedAt: Date;
}
