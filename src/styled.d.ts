import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    textColor: string;
    tabColor: string;
    bgColor: string;
    accentColor: string;
  }
}
