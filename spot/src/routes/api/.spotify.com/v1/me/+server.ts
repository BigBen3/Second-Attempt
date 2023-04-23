export const GET = async ({ url }) => {
    const data = await fetch(url);
    return await data.json();
  };
  