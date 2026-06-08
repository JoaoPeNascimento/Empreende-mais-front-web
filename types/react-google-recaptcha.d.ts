declare module "react-google-recaptcha" {
  import { Component } from "react";

  export type ReCAPTCHAProps = {
    sitekey: string;
    onChange?: (token: string | null) => void;
    onExpired?: () => void;
  };

  export default class ReCAPTCHA extends Component<ReCAPTCHAProps> {
    reset(): void;
  }
}
