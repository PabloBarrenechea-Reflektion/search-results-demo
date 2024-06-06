import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from '@radix-ui/react-icons';
import type {
  ActionProp,
  ItemClickedAction,
  SearchResponseFacet,
  SearchResponseSortChoice,
  SearchResultsInitialState,
  SearchResultsStoreState,
} from '@sitecore-search/react';
import {
  WidgetDataType,
  useSearchResults,
  useSearchResultsActions,
  useSearchResultsSelectedFilters,
  widget,
} from '@sitecore-search/react';
import {
  AccordionFacets,
  ArticleCard,
  FacetItem,
  Pagination,
  Presence,
  SearchResultsAccordionFacets,
  Select,
  SortSelect,
} from '@sitecore-search/ui';
import {parseQueryParams} from "./utils.ts";

type ArticleCardItemCardProps = {
  className?: string;
  displayText?: boolean;
  article: any;
  onItemClick: ActionProp<ItemClickedAction>;
  index: number;
};
type QueryResultsSummaryProps = {
  currentPage: number;
  itemsPerPage: number;
  totalItemsReturned: number;
  totalItems: number;
};
type ResultsPerPageProps = {
  defaultItemsPerPage: number;
};
type SearchFacetsProps = {
  facets: SearchResponseFacet[];
};
type SearchPaginationProps = {
  currentPage: number;
  totalPages: number;
};
type SortOrderProps = {
  options: Array<SearchResponseSortChoice>;
  selected: string;
};
type SpinnerProps = {
  loading?: boolean;
};
const DEFAULT_IMG_URL = 'https://placehold.co/500x300?text=No%20Image'; // TODO: Update with corresponding fallback image
const buildRangeLabel = (min: number | undefined, max: number | undefined): string => {
  return typeof min === 'undefined' ? `< $${max}` : typeof max === 'undefined' ? ` > $${min}` : `$${min} - $${max}`;
};
const buildFacetLabel = (selectedFacet: any) => {
  if ('min' in selectedFacet || 'max' in selectedFacet) {
    return `${buildRangeLabel(selectedFacet.min, selectedFacet.max)}`;
  }
  return `${selectedFacet.valueLabel}`;
};
const ArticleHorizontalItemCard = ({
  className = '',
  article,
  onItemClick,
  index,
}: ArticleCardItemCardProps) => {
  return (
    <ArticleCard.Root
      key={article.id}
      className={`group flex flex-row p-4 my-4 flex-nowrap max-h-52 w-full relative border rounded-md hover:shadow-lg hover:scale-105 hover:transition-all hover:ease-linear	hover:duration-300 focus-within:scale-105 focus-within:transition-all focus-within:ease-linear focus-within:duration-300 focus-within:hover:shadow-lg ${className}`}
    >
      <div className="w-[25%] flex-none overflow-hidden bg-gray-200 ">
        <ArticleCard.Image
          src={article?.image_url || DEFAULT_IMG_URL}
          className="h-full w-full object-cover object-center lg:h-full lg:w-full"
        />
      </div>
      <div className="pl-4 grow flex-col">
        <a
          className="focus:outline-indigo-500"
          href={article.url}
          onClick={(event) => {
            event.preventDefault();
            onItemClick({
              id: article.id,
              index,
              sourceId: article.source_id,
            });
          }}
        >
          <span aria-hidden="true" className="absolute inset-0"></span>
          <ArticleCard.Title className="text-base">{article.title}</ArticleCard.Title>
        </a>
        <ArticleCard.Subtitle className="mt-3 text-sm text-gray-500">{article.author}</ArticleCard.Subtitle>
        {article.description && <div className="line-clamp-3 mt-3 text-sm">{article.description}</div>}
      </div>
    </ArticleCard.Root>
  );
};
const Filter = () => {
  const selectedFacetsFromApi = useSearchResultsSelectedFilters();
  const { onRemoveFilter, onClearFilters } = useSearchResultsActions();
  return selectedFacetsFromApi.length > 0 ? (
    <div className="mb-4">
      <div className="flex flex-row justify-between items-center mb-2">
        <h3 className="text-sm md:text-base font-semibold">Filters</h3>
        <button
          onClick={onClearFilters}
          className="text-sm font-medium text-black underline text-opacity-75 hover:text-indigo-500 hover:opacity-1 focus:outline-indigo-500"
        >
          Clear Filters
        </button>
      </div>
      <div className="flex flex-wrap">
        {selectedFacetsFromApi.map((selectedFacet) => (
          <button
            key={`${selectedFacet.facetId}${selectedFacet.facetLabel}${selectedFacet.valueLabel}`}
            onClick={() => onRemoveFilter(selectedFacet)}
            className="text-ellipsis text-xs font-medium text-white bg-gray-400 rounded-md pl-2 pr-5 py-1.5 m-1 whitespace-no-wrap max-w-full overflow-hidden relative cursor-pointer before:content-[''] before:-rotate-45 before:absolute before:w-2.5 before:h-0.5 before:right-2 before:top-2/4 before:bg-white after:content-[''] after:rotate-45 after:absolute after:w-2.5 after:h-0.5 after:right-2 after:top-2/4 after:bg-white focus:outline-indigo-500"
          >
            {buildFacetLabel(selectedFacet)}
          </button>
        ))}
      </div>
    </div>
  ) : (
    <></>
  );
};
const QueryResultsSummary = ({
  currentPage,
  itemsPerPage,
  totalItems,
  totalItemsReturned,
}: QueryResultsSummaryProps) => {
  return (
    <div className="font-bold my-auto mx-0">
      Showing {itemsPerPage * (currentPage - 1) + 1} - {itemsPerPage * (currentPage - 1) + totalItemsReturned} of{' '}
      {totalItems} results
    </div>
  );
};
const ResultsPerPage = ({ defaultItemsPerPage }: ResultsPerPageProps) => {
  const { onResultsPerPageChange } = useSearchResultsActions();
  return (
    <div>
      <label className="pr-1">Results Per Page</label>
      <Select.Root
        defaultValue={String(defaultItemsPerPage)}
        onValueChange={(v) =>
          onResultsPerPageChange({
            numItems: Number(v),
          })
        }
      >
        <Select.Trigger className="cursor-pointer inline-flex items-center bg-transparent h-10 gap-1 py-1 px-4 border-0 focus:outline-indigo-500">
          <Select.SelectValue />
          <Select.Icon />
        </Select.Trigger>
        <Select.SelectContent className="bg-white shadow-[2px_2px_4px_#CFCFCF] z-[100]">
          <Select.Viewport className="p-1">
            <Select.SelectItem
              value="24"
              className="flex items-center leading-none cursor-pointer select-none whitespace-no-wrap h-6 px-1 hover:bg-indigo-500 hover:text-white data-[state=checked]:text-indigo-500 data-[state=checked]:bg-white focus:outline-indigo-500"
            >
              <SortSelect.OptionText>24</SortSelect.OptionText>
            </Select.SelectItem>

            <Select.SelectItem
              value="48"
              className="flex items-center leading-none cursor-pointer select-none whitespace-no-wrap h-6 px-1 hover:bg-indigo-500 hover:text-white data-[state=checked]:text-indigo-500 data-[state=checked]:bg-white focus:outline-indigo-500"
            >
              <SortSelect.OptionText>48</SortSelect.OptionText>
            </Select.SelectItem>

            <Select.SelectItem
              value="64"
              className="flex items-center leading-none cursor-pointer select-none whitespace-no-wrap h-6 px-1 hover:bg-indigo-500 hover:text-white data-[state=checked]:text-indigo-500 data-[state=checked]:bg-white focus:outline-indigo-500"
            >
              <SortSelect.OptionText>64</SortSelect.OptionText>
            </Select.SelectItem>
          </Select.Viewport>
        </Select.SelectContent>
      </Select.Root>
    </div>
  );
};
const SearchFacets = ({ facets }: SearchFacetsProps) => {
  const { onFacetClick } = useSearchResultsActions();
  return (
    <SearchResultsAccordionFacets
      defaultFacetTypesExpandedList={[]}
      onFacetTypesExpandedListChange={() => {}}
      onFacetValueClick={onFacetClick}
      className="w-full"
    >
      {facets.map((f) => (
        <AccordionFacets.Facet facetId={f.name} key={f.name} className="block border-b mb-4 pb-4 border-gray-200">
          <AccordionFacets.Header className="flex">
            <AccordionFacets.Trigger className="text-sm md:text-base font-semibold focus:outline-indigo-500">
              {f.label}
            </AccordionFacets.Trigger>
          </AccordionFacets.Header>
          <AccordionFacets.Content className="mt-8">
            <AccordionFacets.ValueList className="list-none mt-2 flex flex-col space-y-2">
              {f.value.map((v, index: number) => (
                <FacetItem
                  {...{
                    index,
                    facetValueId: v.id,
                  }}
                  key={v.id}
                  className="group flex items-center text-sm cursor-pointer"
                >
                  <AccordionFacets.ItemCheckbox className="form-checkbox flex-none w-5 h-5 border border-gray-300 rounded cursor-pointer transition duration-500 ease-in-out hover:border-heading focus:outline-indigo-500 aria-checked:bg-indigo-500 aria-checked:hover:bg-heading aria-checked:focus:bg-heading">
                    <AccordionFacets.ItemCheckboxIndicator className="text-white w-5 h-5 ">
                      <CheckIcon />
                    </AccordionFacets.ItemCheckboxIndicator>
                  </AccordionFacets.ItemCheckbox>
                  <AccordionFacets.ItemLabel className="text-sm ms-4 -mt-0.5">
                    {v.text} {v.count && `(${v.count})`}
                  </AccordionFacets.ItemLabel>
                </FacetItem>
              ))}
            </AccordionFacets.ValueList>
          </AccordionFacets.Content>
        </AccordionFacets.Facet>
      ))}
    </SearchResultsAccordionFacets>
  );
};
const SearchPagination = ({ currentPage, totalPages }: SearchPaginationProps) => {
  const { onPageNumberChange } = useSearchResultsActions();
  return (
    <Pagination.Root
      currentPage={currentPage}
      defaultCurrentPage={1}
      totalPages={totalPages}
      onPageChange={(v) =>
        onPageNumberChange({
          page: v,
        })
      }
      className="mt-4 flex"
    >
      <Pagination.PrevPage
        onClick={(e) => e.preventDefault()}
        className="cursor-pointer my-0 mx-2 data-[current=true]:hidden hover:text-indigo-500 focus:outline-indigo-500"
      >
        <ArrowLeftIcon />
      </Pagination.PrevPage>
      <Pagination.Pages>
        {(pagination) =>
          Pagination.paginationLayout(pagination, {
            boundaryCount: 1,
            siblingCount: 1,
          }).map(({ page, type }) =>
            type === 'page' ? (
              <Pagination.Page
                key={page}
                aria-label={`Page ${page}`}
                page={page as number}
                onClick={(e) => e.preventDefault()}
                className="cursor-pointer my-0 mx-2 data-[current=true]:text-indigo-500 data-[current=true]:pointer-events-none data-[current=true]:no-underline hover:text-indigo-500 focus:outline-indigo-500"
              >
                {page}
              </Pagination.Page>
            ) : (
              <span key={type}>...</span>
            ),
          )
        }
      </Pagination.Pages>
      <Pagination.NextPage
        onClick={(e) => e.preventDefault()}
        className="cursor-pointer my-0 mx-2 data-[current=true]:hidden hover:text-indigo-500 focus:outline-indigo-500"
      >
        <ArrowRightIcon />
      </Pagination.NextPage>
    </Pagination.Root>
  );
};
const SortOrder = ({ options, selected }: SortOrderProps) => {
  const selectedSortIndex = options.findIndex((s) => s.name === selected);
  const { onSortChange } = useSearchResultsActions();
  return (
    <SortSelect.Root defaultValue={options[selectedSortIndex]?.name} onValueChange={onSortChange}>
      <SortSelect.Trigger className="cursor-pointer inline-flex items-center bg-transparent h-10 gap-1 py-1 px-4 border-0 focus:outline-indigo-500">
        <SortSelect.SelectValue>
          {selectedSortIndex > -1 ? options[selectedSortIndex].label : ''}
        </SortSelect.SelectValue>
        <SortSelect.Icon />
      </SortSelect.Trigger>
      <SortSelect.Content className="bg-white shadow-[2px_2px_4px_#CFCFCF] z-[100] absolute top-8 focus-within:border-indigo-500">
        <SortSelect.Viewport className="p-1 z-[50000]">
          {options.map((option: any) => (
            <SortSelect.Option
              value={option}
              key={option.name}
              className="flex items-center leading-none cursor-pointer select-none whitespace-no-wrap h-6 px-1 hover:bg-indigo-500 hover:text-white data-[state=checked]:text-indigo-500 data-[state=checked]:bg-white focus:outline-indigo-500"
            >
              <SortSelect.OptionText>{option.label}</SortSelect.OptionText>
            </SortSelect.Option>
          ))}
        </SortSelect.Viewport>
      </SortSelect.Content>
    </SortSelect.Root>
  );
};
const Spinner = ({ loading = false }: SpinnerProps) => {
  return (
    <Presence present={loading}>
      <div className="text-center">
        <div role="status">
          <svg
            aria-busy={loading}
            aria-hidden={!loading}
            focusable="false"
            role="progressbar"
            viewBox="0 0 20 20"
            className="inline animate-spin w-10 text-slate-900"
          >
            <path d="M7.229 1.173a9.25 9.25 0 1 0 11.655 11.412 1.25 1.25 0 1 0-2.4-.698 6.75 6.75 0 1 1-8.506-8.329 1.25 1.25 0 1 0-.75-2.385z" />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    </Presence>
  );
};
type ArticleModel = {
  id: string;
  type?: string;
  title?: string;
  name?: string;
  subtitle?: string;
  url?: string;
  description?: string;
  content_text?: string;
  image_url?: string;
  source_id?: string;
};
type ArticleSearchResultsProps = {
  defaultSortType?: SearchResultsStoreState['sortType'];
  defaultPage?: SearchResultsStoreState['page'];
  defaultItemsPerPage?: SearchResultsStoreState['itemsPerPage'];
  defaultKeyphrase?: SearchResultsStoreState['keyphrase'];
};
type InitialState = SearchResultsInitialState<'itemsPerPage' | 'keyphrase' | 'page' | 'sortType' | 'selectedFacets'>;
export const SearchWidgetComponent = ({
  defaultSortType = 'featured_desc',
  defaultPage = 1,
  defaultKeyphrase = '',
  defaultItemsPerPage = 24,
}: ArticleSearchResultsProps) => {
  const queryParams = parseQueryParams(window.location.search);
  const {
    widgetRef,
    actions: { onItemClick },
    state: { sortType, page, itemsPerPage },
    queryResult: {
      isLoading,
      isFetching,
      data: {
        total_item: totalItems = 0,
        sort: { choices: sortChoices = [] } = {},
        facet: facets = [],
        content: articles = [],
      } = {},
    },
  } = useSearchResults<ArticleModel, InitialState>({
    config: {
      defaultFacetType: 'text', // Configuring facet behavior to use text filter
    },
    state: {
      sortType: defaultSortType,
      page: defaultPage,
      itemsPerPage: defaultItemsPerPage,
      keyphrase: defaultKeyphrase,
      selectedFacets: queryParams.map(({key, value}) => ({
        facetId: key,
        facetValueText: value[0].toUpperCase() + value.slice(1), // just for this example we are using type as facets and those are stored capitalized
      })),
    },
  });
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen w-full bg-white">
        <Spinner loading />
      </div>
    );
  }
  return (
    <div ref={widgetRef}>
      <div className="flex relative max-w-full px-4 text-black text-opacity-75">
        {isFetching && (
          <div className="w-full h-full fixed top-0 left-0 bottom-0 right-0 z-30 bg-white opacity-50">
            <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] flex flex-col justify-center items-center z-40">
              <Spinner loading />
            </div>
          </div>
        )}
        {totalItems > 0 && (
          <>
            <section className="flex flex-col flex-none relative mt-4 mr-8 w-[25%]">
              <Filter />

              <SearchFacets facets={facets} />
            </section>
            <section className="flex flex-col flex-[4_1_0%]">
              {/* Sort Select */}
              <section className="flex justify-between text-xs">
                {totalItems > 0 && (
                  <QueryResultsSummary
                    currentPage={page}
                    itemsPerPage={itemsPerPage}
                    totalItems={totalItems}
                    totalItemsReturned={articles.length}
                  />
                )}
                <SortOrder options={sortChoices} selected={sortType} />
              </section>

              {/* Results */}
              <div className="w-full">
                {articles.map((a, index) => (
                  <ArticleHorizontalItemCard
                    key={a.id}
                    article={a as ArticleModel}
                    index={index}
                    onItemClick={onItemClick}
                    displayText={true}
                  />
                ))}
              </div>
              <div className="flex flex-col md:flex-row md:justify-between text-xs">
                <ResultsPerPage defaultItemsPerPage={defaultItemsPerPage} />
                <SearchPagination currentPage={page} totalPages={totalPages} />
              </div>
            </section>
          </>
        )}
        {totalItems <= 0 && !isFetching && (
          <div className="w-full flex justify-center">
            <h3>0 Results</h3>
          </div>
        )}
      </div>
    </div>
  );
};
const SearchWidgetWidget = widget(SearchWidgetComponent, WidgetDataType.SEARCH_RESULTS, 'content');
export default SearchWidgetWidget;
