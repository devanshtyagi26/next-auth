export function createApiResponse(
  success = false,
  message = "Something went wrong",
  status = 500,
  error = null
) {
  if (error) {
    console.error(message, error);
  }

  return Response.json(
    {
      success,
      message,
    },
    { status }
  );
}
