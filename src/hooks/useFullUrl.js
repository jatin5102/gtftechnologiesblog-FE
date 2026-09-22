import { useRouter } from "next/router";
import { useMemo } from "react";
import { SITE_URL } from "@/lib/urls";

const useFullUrl = () => {
  const router = useRouter();

  const fullUrl = useMemo(() => {
    // Avoid returning an unreliable path before dynamic route params are
    // resolved — callers skip the canonical tag rather than emit a wrong one.
    if (!router.isReady || !router.asPath || router.asPath.includes("[")) {
      return null;
    }

    // Strip query strings and hash fragments — canonical/OG URLs shouldn't
    // include them, or the same page reports several canonicals.
    const path = router.asPath.split("#")[0].split("?")[0];

    // Always build from SITE_URL, never window.location.origin, so preview and
    // staging hosts can't point canonicals at themselves.
    return `${SITE_URL}${path}`;
  }, [router.asPath, router.isReady]);

  return fullUrl;
};

export default useFullUrl;
