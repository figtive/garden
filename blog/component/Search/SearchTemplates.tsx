import Stage, { stages } from "../Stage.tsx";

function StageOptions({ iconOnly = false }: { iconOnly?: boolean }) {
  return stages.map((stage) => (
    <Stage key={stage} stage={stage} iconOnly={iconOnly} />
  ));
}

function SearchTemplates() {
  return (
    <>
      <template id="search-group">
        {/** biome-ignore lint/a11y/useSemanticElements: group here is for search previews, not form controls */}
        <div className="search__group" role="group" data-show-stage="">
          <div className="search__group-head">
            <StageOptions iconOnly />
            {/** biome-ignore lint/a11y/useValidAnchor: href is set later when the group is cloned */}
            <a className="search__group-title">
              <span data-slot="title" />
            </a>
            <span className="search__group-date" data-slot="date" />
          </div>
          <div className="search__group-rows" />
          <button type="button" className="search__more" data-slot="more" />
        </div>
      </template>

      <template id="search-row">
        {/** biome-ignore lint/a11y/useValidAnchor: href is set later when the row is cloned */}
        <a className="search__link" role="option">
          <span className="search__heading" data-slot="heading" />
          <span className="search__snippet" data-slot="snippet" />
        </a>
      </template>

      <template id="search-preview">
        <div className="text-meta search__preview-meta" data-show-stage="">
          <StageOptions />
          <span data-slot="tended" />
          <span data-slot="reading-time" />
        </div>
        <p className="search__preview-title" data-slot="title" />
        <p className="text-lede search__preview-lede" data-slot="lede" />
        <div className="prose search__preview-prose" data-slot="body" />
      </template>
    </>
  );
}

export default SearchTemplates;
