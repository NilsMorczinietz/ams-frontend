type BackendErrorBody = {
  message?: string | string[];
  error?: string;
  code?: string;
};

function parseBackendErrorBody(bodyText: string): BackendErrorBody | null {
  if (!bodyText) {
    return null;
  }

  try {
    return JSON.parse(bodyText) as BackendErrorBody;
  } catch {
    return null;
  }
}

function getStatusFallbackMessage(status: number): string {
  switch (status) {
    case 400:
      return 'Ungueltige Anfrage (400).';
    case 401:
      return 'Nicht autorisiert (401). Bitte erneut anmelden.';
    case 403:
      return 'Zugriff verweigert (403).';
    case 404:
      return 'Ressource nicht gefunden (404).';
    case 409:
      return 'Konflikt mit bestehendem Datensatz (409).';
    case 422:
      return 'Validierung fehlgeschlagen (422).';
    default:
      if (status >= 500) {
        return `Serverfehler (${status}).`;
      }

      return `Anfrage fehlgeschlagen (${status}).`;
  }
}

function getMessageFromBody(body: BackendErrorBody | null): string | null {
  if (!body) {
    return null;
  }

  if (typeof body.message === 'string' && body.message.trim().length > 0) {
    return body.message;
  }

  if (Array.isArray(body.message) && body.message.length > 0) {
    return body.message.join(', ');
  }

  if (typeof body.error === 'string' && body.error.trim().length > 0) {
    return body.error;
  }

  return null;
}

export class ApiHttpError extends Error {
  status: number;
  code?: string;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.name = 'ApiHttpError';
    this.status = status;
    this.code = code;
  }

  static async fromResponse(response: Response): Promise<ApiHttpError> {
    const bodyText = await response.clone().text();
    const body = parseBackendErrorBody(bodyText);
    const bodyMessage = getMessageFromBody(body);
    const fallbackMessage = getStatusFallbackMessage(response.status);

    return new ApiHttpError(
      response.status,
      bodyMessage ?? fallbackMessage,
      body?.code
    );
  }
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiHttpError) {
    return error.message;
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return fallback;
}
