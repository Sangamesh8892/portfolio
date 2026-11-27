/**
 * Soft colour field behind every page: a few large blurred lights in the theme
 * colours, drifting slowly (CSS transform only, no WebGL). It gives the liquid
 * glass something to refract. Sits under the FluidCursor; styles in site.css.
 */
export default function ColorField() {
  return (
    <div className="color-field" aria-hidden="true">
      <i className="cf-1" />
      <i className="cf-2" />
      <i className="cf-3" />
      <i className="cf-4" />
    </div>
  );
}
