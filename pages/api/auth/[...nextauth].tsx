import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "username" },
        password: { label: "Password", type: "password" },
      },

      async authorize(
        credentials: Record<"username" | "password", string> | undefined
      ) {
        const bodyData = JSON.stringify({
          userId: credentials?.username,
          userPass: credentials?.password,
        });

        const res = await (
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
            method: "POST",
            body: bodyData,
            headers: {
              "Content-Type": "application/json",
              "x-client": "dev",
            },
          })
        ).json();

        console.log(
          "res >> ",
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`
        );
        console.log("res >> ", res);

        const { data } = res;

        if (data) {
          const returnData = {
            user: {
              ...data.userDetailDto,
            },
            token: data.jwtToken,
          };
          if (returnData) {
            return returnData;
          } else {
            return null;
          }
        } else {
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.accessToken = user.token.accessToken;
        token.refreshToken = user.token.refreshToken;
        token.user = user.user;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.user = token.user as any;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  debug: true,
});
