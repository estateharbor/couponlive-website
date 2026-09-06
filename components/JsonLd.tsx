// Emits a <script type="application/ld+json"> block. Server component, so the
// structured data is baked into the static HTML for crawlers and AI engines.
// dangerouslySetInnerHTML is the Next-recommended way (and avoids React's
// "script tag as child" restriction).
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify escapes </script> sequences in string values as <,
      // but our data is controlled; guard the closing tag just in case.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
