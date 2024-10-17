## GitHub OAuth Application (Client ID and Secret)

To enable GitHub OAuth authentication for your application, you need to create a GitHub OAuth app to obtain a **Client ID** and **Client Secret**.

To get the available callback URLs from `next-auth`, you can visit this link while developing the application: [http://localhost:3000/api/auth/providers](http://localhost:3000/api/auth/providers).

### Follow the steps

1. Go to [GitHub](https://github.com) and log in to your account.
2. Ensure you are logged in to an account that has the permission to create OAuth apps.
3. In the top-right corner of the GitHub interface, click on your profile picture and select **Settings** from the dropdown menu.
4. On the left sidebar, scroll down and click **Developer settings**.
5. In **Developer settings**, click on **OAuth Apps**.
6. Click the **New OAuth App** button on the top-right corner.
7. Fill in the form with the following detail
   - **Application Name**: A name for your application (e.g., `My App` or `NextAuth Integration`).
   - **Homepage URL**: Provide the URL for your app. For local development, use: `http://localhost:3000`. You should change it for **Production** deployment.
   - **Authorization Callback URL**: This is where users will be redirected after they authenticate with GitHub. For local development, use: `http://localhost:3000/api/auth/callback/github`. For production, use your app’s URL. Like: `https://myapp.com/api/auth/callback/github`
8. Add these to your environment variables:
   ```bash
   AUTH_GITHUB_ID=your_github_client_id
   AUTH_GITHUB_SECRET=your_github_client_secret
   ```

## Google OAuth Application (Client ID and Secret)

To enable Google OAuth authentication for your application, you need to create a Google OAuth app to obtain a **Client ID** and **Client Secret**.

To get the available callback URLs from `next-auth`, you can visit this link while developing the application: [http://localhost:3000/api/auth/providers](http://localhost:3000/api/auth/providers).

### Follow the steps

1. Go to the [Google Cloud Console](https://console.cloud.google.com/) and log in to your Google account.
2. Once logged in, create a new project or select an existing one.
3. In the left-hand menu, click on **APIs & Services**, and then click **OAuth consent screen**.
4. Under the **OAuth consent screen**, select **User Type** - `External` and click on the **Create** button.
5. Configure the following:
   - **App Name**: Provide a name for your application.
   - **User support email**: Choose your email or a support email.
   - **Authorized domains**: Add `localhost` for development (or you can skip it on development), or your production domain (e.g., `myapp.com`).
   - **Developer contact information**: Enter developer email address
   - Fill in other required fields, if needed. Then click **Save and Continue**. Then in the next `Scopes`, `Test users` and `Summery` steps, just click on **Save and Continue**. (If needed to add any information, fill them out.).
6. After setting up the OAuth consent screen, go to **Credentials** in the left-hand menu and click **Create Credentials**, then choose **OAuth Client ID**.
7. Fill in the following details:
   - **Application Type**: Select **Web application**.
   - **Name**: Give your OAuth client a descriptive name (e.g., `Auth a to z integration`).
   - **Authorized JavaScript origins**: Add your local or production callback URLs:
     - For local development, use- `http://localhost:3000/api/auth/callback/google`
     - For production, like this- `https://myapp.com/api/auth/callback/google`
   - **Authorized redirect URIs**: Add your local or production callback URLs:
     - For local development, use- `http://localhost:3000`
     - For production, like this- `https://myapp.com`
8. Click **Create** and Google will provide you with a **Client ID** and **Client Secret**.
9. Add these to your environment variables:
   ```bash
   AUTH_GOOGLE_ID=your_google_client_id
   AUTH_GOOGLE_SECRET=your_google_client_secret
   ```
