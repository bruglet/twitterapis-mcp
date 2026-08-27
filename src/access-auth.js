import { createRemoteJWKSet, jwtVerify } from "jose";

const ACCESS_JWT_HEADER = "cf-access-jwt-assertion";

function getHeader(request, name) {
  if (typeof request?.headers?.get === "function") {
    return request.headers.get(name);
  }
  const value = request?.headers?.[name.toLowerCase()];
  return Array.isArray(value) ? null : value;
}

function normalizeTeamDomain(teamDomain) {
  if (!teamDomain) {
    throw new Error("CF_ACCESS_TEAM_DOMAIN is required");
  }

  let domain;
  try {
    domain = new URL(teamDomain);
  } catch {
    throw new Error("CF_ACCESS_TEAM_DOMAIN must be a valid HTTPS URL");
  }

  if (domain.protocol !== "https:" || domain.pathname !== "/" || domain.search || domain.hash) {
    throw new Error("CF_ACCESS_TEAM_DOMAIN must be a valid HTTPS origin");
  }

  return domain.origin;
}

export function createAccessAuthenticator({
  teamDomain = process.env.CF_ACCESS_TEAM_DOMAIN,
  audience = process.env.CF_ACCESS_AUD,
  jwksUri,
} = {}) {
  const issuer = normalizeTeamDomain(teamDomain);
  if (!audience) {
    throw new Error("CF_ACCESS_AUD is required");
  }

  const signingKeys = createRemoteJWKSet(
    new URL(jwksUri || "/cdn-cgi/access/certs", issuer),
  );

  return async function authenticate(request) {
    const token = getHeader(request, ACCESS_JWT_HEADER);
    if (!token) {
      return false;
    }

    try {
      await jwtVerify(token, signingKeys, {
        algorithms: ["RS256"],
        audience,
        issuer,
        requiredClaims: ["exp"],
      });
      return true;
    } catch {
      return false;
    }
  };
}
