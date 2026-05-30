import "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    isAdmin?: boolean;
    roles?: string[];
    permissions?: string[];
  }
}
