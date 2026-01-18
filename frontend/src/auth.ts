import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import MicrosoftEntraId from 'next-auth/providers/microsoft-entra-id';

const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google, GitHub, MicrosoftEntraId],
}) as any;

export { handlers, auth, signIn, signOut };
