// components/PictureImage.tsx
export default function CustomImage({
  src,
  mobileSrc,
  alt = '',
  className = '',
  loading = 'lazy',
}) {
  return (
    <picture>
      <source srcSet={mobileSrc} media="(max-width: 768px)" type="image/webp" />
      <source srcSet={src} media="(min-width: 769px)" type="image/webp" />
      <img
        src={src}
        alt={alt}
        loading={loading}
        className={className}
      />
    </picture>
  );
}
