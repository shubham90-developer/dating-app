interface Msg91Response {
  type: "success" | "error";
  message: string;
  [key: string]: unknown;
}

export const verifyWidgetToken = async (
  accessToken: string,
): Promise<Msg91Response> => {
  const response = await fetch(
    "https://control.msg91.com/api/v5/widget/verifyAccessToken",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        authkey: process.env.MSG91_AUTH_KEY,
        "access-token": accessToken,
      }),
    },
  );
  return response.json();
};
