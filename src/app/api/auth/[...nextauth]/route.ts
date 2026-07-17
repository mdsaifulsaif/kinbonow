

// import NextAuth, { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google";

// // ✅ Module-level lock — একই সময়ে একাধিক parallel request আসলেও
// // শুধু একটাই refresh call backend এ যাবে, বাকি সব সেই একই promise শেয়ার করবে
// let refreshPromise: Promise<any> | null = null;

// async function refreshAccessToken(token: any) {
//   // ইতিমধ্যে একটা refresh call চলমান থাকলে, নতুন call না করে সেটাই await করো
//   if (refreshPromise) {
//     console.log("⏳ [JWT] Refresh already in progress, reusing existing promise...");
//     return refreshPromise;
//   }

//   refreshPromise = (async () => {
//     try {
//       console.log("🔄 [JWT] Token expired, calling refresh...");

//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ refreshToken: token.refreshToken }),
//       });

//       const result = await res.json();

//       if (!res.ok || !result?.data?.accessToken) {
//         console.error("🔴 [JWT] Refresh failed:", result?.message);
//         return { ...token, error: "RefreshAccessTokenError" };
//       }

//       const newToken = {
//         ...token,
//         accessToken: result.data.accessToken,
//         accessTokenExpires: result.data.accessTokenExpires,
//       };
//       delete newToken.error; // আগে কোনো error থাকলে মুছে দাও, refresh সফল হয়েছে

//       console.log(
//         "✅ [JWT] Refreshed, new expiry:",
//         new Date(newToken.accessTokenExpires).toISOString(),
//       );

//       return newToken;
//     } catch (err) {
//       console.error("🔴 [JWT] Refresh request failed:", err);
//       return { ...token, error: "RefreshAccessTokenError" };
//     } finally {
//       // ✅ কাজ শেষে lock ছেড়ে দাও, পরের বার নতুন করে refresh করতে পারবে
//       refreshPromise = null;
//     }
//   })();

//   return refreshPromise;
// }

// export const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error("Email and password required");
//         }

//         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             email: credentials.email,
//             password: credentials.password,
//           }),
//         });

//         const result = await res.json();

//         if (!res.ok || !result?.accessToken) {
//           throw new Error(result?.message || "Invalid email or password");
//         }

//         const user = result.data;

//         return {
//           id: user._id,
//           firstName: user.firstName,
//           lastName: user.lastName,
//           email: user.email,
//           role: user.role,
//           accessToken: result.accessToken,
//           refreshToken: result.refreshToken,
//           accessTokenExpires: result.accessTokenExpires,
//         };
//       },
//     }),

//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//     }),
//   ],

//   session: {
//     strategy: "jwt",
//   },

//   pages: {
//     signIn: "/login",
//     error: "/login",
//   },

//   callbacks: {
//     async signIn({ user, account }) {
//       if (account?.provider === "google") {
//         try {
//           const res = await fetch(
//             `${process.env.NEXT_PUBLIC_API_URL}/auth/google-login`,
//             {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify({
//                 email: user.email,
//                 firstName: user.name?.split(" ")[0] || "Google",
//                 lastName: user.name?.split(" ").slice(1).join(" ") || "User",
//                 googleId: account.providerAccountId,
//                 avatarUrl: user.image || undefined,
//               }),
//             }
//           );

//           const result = await res.json();

//           if (!res.ok || !result?.accessToken) {
//             console.error("Google social login backend error:", result?.message);
//             return false;
//           }

//           (user as any).accessToken = result.accessToken;
//           (user as any).refreshToken = result.refreshToken;
//           (user as any).accessTokenExpires = result.accessTokenExpires;
//           (user as any).id = result.data._id;
//           (user as any).role = result.data.role;
//           (user as any).firstName = result.data.firstName;
//           (user as any).lastName = result.data.lastName;

//           return true;
//         } catch (err) {
//           console.error("Google social login failed:", err);
//           return false;
//         }
//       }

//       return true;
//     },

//     async jwt({ token, user }) {
//       // ---------- প্রথমবার login ----------
//       if (user) {
//         token.accessToken = (user as any).accessToken;
//         token.refreshToken = (user as any).refreshToken;
//         token.accessTokenExpires = (user as any).accessTokenExpires;
//         token.id = (user as any).id;
//         token.role = (user as any).role;
//         token.firstName = (user as any).firstName;
//         token.lastName = (user as any).lastName;

//         console.log(
//           "🟢 [JWT] First login, token expires at:",
//           new Date(token.accessTokenExpires as number).toISOString(),
//         );
//         return token;
//       }

//       // ---------- Access token এখনো valid (এখনো মেয়াদ আছে) ----------
//       if (Date.now() < (token.accessTokenExpires as number) - 5_000) {
//         return token; // এখনো refresh লাগবে না
//       }

//       // ---------- Access token expire হয়ে গেছে/হতে যাচ্ছে — deduplicated refresh call ----------
//       return refreshAccessToken(token); // ✅ race-condition-safe
//     },

//     async session({ session, token }) {
//       session.accessToken = token.accessToken as string;
//       session.user.id = token.id as string;
//       session.user.role = token.role as string;
//       session.user.firstName = token.firstName as string;
//       session.user.lastName = token.lastName as string;
//       (session as any).error = token.error;
//       return session;
//     },
//   },

//   secret: process.env.NEXTAUTH_SECRET,
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };


import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// ✅ Module-level lock — একই সময়ে একাধিক parallel request আসলেও
// শুধু একটাই refresh call backend এ যাবে, বাকি সব সেই একই promise শেয়ার করবে
let refreshPromise: Promise<any> | null = null;

async function refreshAccessToken(token: any) {
  if (refreshPromise) {
    console.log("⏳ [JWT] Refresh already in progress, reusing existing promise...");
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      console.log("🔄 [JWT] Token expired, calling refresh...");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: token.refreshToken }),
      });

      const result = await res.json();

      if (!res.ok || !result?.data?.accessToken) {
        console.error("🔴 [JWT] Refresh failed:", result?.message);
        return { ...token, error: "RefreshAccessTokenError" };
      }

      const newToken = {
        ...token,
        accessToken: result.data.accessToken,
        accessTokenExpires: result.data.accessTokenExpires,
      };
      delete newToken.error;

      console.log(
        "✅ [JWT] Refreshed, new expiry:",
        new Date(newToken.accessTokenExpires).toISOString(),
      );

      return newToken;
    } catch (err) {
      console.error("🔴 [JWT] Refresh request failed:", err);
      return { ...token, error: "RefreshAccessTokenError" };
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export const authOptions: NextAuthOptions = {
  providers: [
    // ✅ Admin panel এ শুধু email/password — GoogleProvider বাদ দেওয়া হয়েছে
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        const result = await res.json();

        if (!res.ok || !result?.accessToken) {
          throw new Error(result?.message || "Invalid email or password");
        }

        const user = result.data;

        // ✅ admin panel এ শুধু admin role ঢুকতে পারবে — অন্য role হলে এখানেই আটকে দিচ্ছি
        if (user.role !== "admin") {
          throw new Error("Access denied. Admins only.");
        }

        return {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          accessTokenExpires: result.accessTokenExpires,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  // ✅ দুটো app (rider frontend পোর্ট 3000, admin পোর্ট 3001) একই localhost domain এ
  // চললে cookie নাম আলাদা না রাখলে session একে অপরকে ওভাররাইট করে ফেলে
  cookies: {
    sessionToken: {
      name: "admin-next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
        token.accessTokenExpires = (user as any).accessTokenExpires;
        token.id = (user as any).id;
        token.role = (user as any).role;
        token.firstName = (user as any).firstName;
        token.lastName = (user as any).lastName;

        console.log(
          "🟢 [JWT] First login, token expires at:",
          new Date(token.accessTokenExpires as number).toISOString(),
        );
        return token;
      }

      if (Date.now() < (token.accessTokenExpires as number) - 5_000) {
        return token;
      }

      return refreshAccessToken(token);
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      session.user.firstName = token.firstName as string;
      session.user.lastName = token.lastName as string;
      (session as any).error = token.error;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };