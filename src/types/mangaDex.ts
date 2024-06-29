/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface MangaRequest {
  title?: LocalizedString;
  altTitles?: LocalizedString[];
  description?: LocalizedString;
  authors?: string[];
  artists?: string[];
  links?: Record<string, string>;

  /** @pattern ^[a-z]{2}(-[a-z]{2})?$ */
  originalLanguage?: string;
  lastVolume?: string | null;
  lastChapter?: string | null;
  publicationDemographic?: "shounen" | "shoujo" | "josei" | "seinen" | null;
  status?: "completed" | "ongoing" | "cancelled" | "hiatus";

  /**
   * Year of release
   * @min 1
   * @max 9999
   */
  year?: number | null;
  contentRating?: "safe" | "suggestive" | "erotica" | "pornographic";
  chapterNumbersResetOnNewVolume?: boolean;
  tags?: string[];

  /** @format uuid */
  primaryCover?: string | null;

  /** @min 1 */
  version?: number;
}

export type LocalizedString = Record<string, string>;

export interface MangaResponse {
  result: "ok" | "error";
  response: string;
  data: Manga;
}

export interface MangaSearchResponse {
  result: "ok" | "error";
  response: string;
  data: Array<Manga>;
}

export interface ChapterResponse {
  result: "ok" | "error";
  response: string;
  data: Chapter;
}

export interface Relationship {
  /** @format uuid */
  id: string;
  type: string;

  /** Related Manga type, only present if you are on a Manga entity and a Manga relationship */
  related:
    | "monochrome"
    | "main_story"
    | "adapted_from"
    | "based_on"
    | "prequel"
    | "side_story"
    | "doujinshi"
    | "same_franchise"
    | "shared_universe"
    | "sequel"
    | "spin_off"
    | "alternate_story"
    | "alternate_version"
    | "preserialization"
    | "colored"
    | "serialization";

  /** If Reference Expansion is applied, contains objects attributes */
  attributes: object | null;
}

export interface Chapter {
  /** @format uuid */
  id: string;
  type: "chapter";
  attributes: ChapterAttributes;
  relationships: Relationship[];
}

export interface Manga {
  /** @format uuid */
  id: string;
  type: "manga";
  attributes: MangaAttributes;
  relationships: Relationship[];
}

export interface ErrorResponse {
  result: string;
  errors: Error[];
}

export interface Error {
  id: string;
  status: number;
  title: string;
  detail: string;
}

export interface ChapterAttributes {
  title: string;
  volume: string | null;
  chapter: string | null;

  /** Count of readable images for this chapter */
  pages?: number;

  /** @pattern ^[a-z]{2}(-[a-z]{2})?$ */
  translatedLanguage?: string;

  /** @format uuid */
  uploader?: string;

  /**
   * Denotes a chapter that links to an external source.
   * @pattern ^https?://
   */
  externalUrl?: string | null;

  /** @min 1 */
  version?: number;
  createdAt?: string;
  updatedAt?: string;
  publishAt?: string;
  readableAt?: string;
}

export interface MangaAttributes {
  title?: LocalizedString;
  altTitles?: LocalizedString[];
  description?: LocalizedString;
  isLocked?: boolean;
  links?: Record<string, string>;
  originalLanguage?: string;
  lastVolume?: string | null;
  lastChapter?: string | null;
  publicationDemographic?: "shounen" | "shoujo" | "josei" | "seinen" | null;
  status?: "completed" | "ongoing" | "cancelled" | "hiatus";

  /** Year of release */
  year?: number | null;
  contentRating?: "safe" | "suggestive" | "erotica" | "pornographic";
  chapterNumbersResetOnNewVolume?: boolean;
  availableTranslatedLanguages?: any[];
  tags?: Tag[];
  state?: "draft" | "submitted" | "published" | "rejected";

  /** @min 1 */
  version?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type MangaCreate = MangaRequest;

export type MangaEdit = MangaRequest;

export type ChapterEdit = ChapterRequest;

export interface Response {
  result?: "ok" | "error";
}

export interface Login {
  username?: string;
  email?: string;
  password: string;
}

export interface LoginResponse {
  result?: "ok" | "error";
  token?: { session?: string; refresh?: string };
}

export interface CheckResponse {
  result?: string;
  isAuthenticated?: boolean;
  roles?: string[];
  permissions?: string[];
}

export interface LogoutResponse {
  result?: "ok" | "error";
}

export interface RefreshToken {
  token: string;
}

export interface RefreshResponse {
  result: "ok" | "error";
  token?: { session?: string; refresh?: string };
  message?: string;
}

export interface AccountActivateResponse {
  result?: "ok";
}

export interface CreateAccount {
  username: string;
  password: string;

  /** @format email */
  email: string;
}

export interface ScanlationGroupResponse {
  result?: "ok";
  response?: string;
  data?: ScanlationGroup;
}

export interface ScanlationGroup {
  /** @format uuid */
  id?: string;
  type?: "scanlation_group";
  attributes?: ScanlationGroupAttributes;
  relationships?: Relationship[];
}

export interface ScanlationGroupAttributes {
  name?: string;
  altNames?: LocalizedString[];
  website?: string | null;
  ircServer?: string | null;
  ircChannel?: string | null;
  discord?: string | null;
  contactEmail?: string | null;
  description?: string | null;

  /**
   * @format uri
   * @pattern ^https?://
   */
  twitter?: string | null;

  /**
   * @format uri
   * @pattern ^https:\/\/www\.mangaupdates\.com\/(group|publisher)(s\.html\?id=\d+|\/[\w-]+\/?([\w-]+)?(\/)?)$
   */
  mangaUpdates?: string | null;
  focusedLanguage?: string[] | null;
  locked?: boolean;
  official?: boolean;
  inactive?: boolean;

  /**
   * Should respected ISO 8601 duration specification: https://en.wikipedia.org/wiki/ISO_8601#Durations
   * @pattern ^(P([1-9]|[1-9][0-9])D)?(P?([1-9])W)?(P?T(([1-9]|1[0-9]|2[0-4])H)?(([1-9]|[1-5][0-9]|60)M)?(([1-9]|[1-5][0-9]|60)S)?)?$
   * @example P4D
   */
  publishDelay?: string;

  /** @min 1 */
  version?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  /** @format uuid */
  id?: string;
  type?: "user";
  attributes?: UserAttributes;
  relationships?: Relationship[];
}

export interface UserAttributes {
  username?: string;
  roles?: string[];

  /** @min 1 */
  version?: number;
}

export interface CreateScanlationGroup {
  name: string;
  website?: string | null;
  ircServer?: string | null;
  ircChannel?: string | null;
  discord?: string | null;
  contactEmail?: string | null;
  description?: string | null;

  /**
   * @format uri
   * @pattern ^https?://twitter\.com
   */
  twitter?: string | null;

  /** @pattern ^https:\/\/www\.mangaupdates\.com\/(group|publisher)(s\.html\?id=\d+|\/[\w-]+\/?([\w-]+)?(\/)?)$ */
  mangaUpdates?: string | null;
  inactive?: boolean;

  /** @pattern ^P(([1-9]|[1-9][0-9])D)?(([1-9])W)?(T(([1-9]|1[0-9]|2[0-4])H)?(([1-9]|[1-5][0-9]|60)M)?(([1-9]|[1-5][0-9]|60)S)?)?$ */
  publishDelay?: string | null;
}

export interface ScanlationGroupEdit {
  name?: string;

  /** @format uuid */
  leader?: string;
  members?: string[];
  website?: string | null;
  ircServer?: string | null;
  ircChannel?: string | null;
  discord?: string | null;
  contactEmail?: string | null;
  description?: string | null;

  /**
   * @format uri
   * @pattern ^https?://
   */
  twitter?: string | null;

  /**
   * @format uri
   * @pattern ^https:\/\/www\.mangaupdates\.com\/(group|publisher)(s\.html\?id=\d+|\/[\w-]+\/?([\w-]+)?(\/)?)$
   */
  mangaUpdates?: string | null;
  focusedLanguages?: string[] | null;
  inactive?: boolean;
  locked?: boolean;
  publishDelay?: string;

  /** @min 1 */
  version: number;
}

export interface CustomListCreate {
  name: string;
  visibility?: "public" | "private";
  manga?: string[];

  /** @min 1 */
  version?: number;
}

export interface CustomListEdit {
  name?: string;
  visibility?: "public" | "private";
  manga?: string[];

  /** @min 1 */
  version: number;
}

export interface CustomListResponse {
  result?: "ok" | "error";
  response?: string;
  data?: CustomList;
}

export interface CustomList {
  /** @format uuid */
  id?: string;
  type?: "custom_list";
  attributes?: CustomListAttributes;
  relationships?: Relationship[];
}

export interface CustomListAttributes {
  name?: string;
  visibility?: "private" | "public";

  /** @min 1 */
  version?: number;
}

export interface CoverResponse {
  result?: string;
  response?: string;
  data?: Cover;
}

export interface Cover {
  /** @format uuid */
  id?: string;
  type?: "cover_art";
  attributes?: CoverAttributes;
  relationships?: Relationship[];
}

export interface CoverAttributes {
  volume?: string | null;
  fileName?: string;
  description?: string | null;
  locale?: string | null;

  /** @min 1 */
  version?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CoverEdit {
  volume: string | null;
  description?: string | null;

  /** @pattern ^[a-z]{2}(-[a-z]{2})?$ */
  locale?: string | null;

  /** @min 1 */
  version: number;
}

export interface AuthorResponse {
  result?: string;
  response?: string;
  data?: Author;
}

export interface Author {
  /** @format uuid */
  id?: string;
  type?: "author";
  attributes?: AuthorAttributes;
  relationships?: Relationship[];
}

export interface AuthorAttributes {
  name?: string;
  imageUrl?: string;
  biography?: LocalizedString;

  /**
   * @format uri
   * @pattern ^https?://twitter\.com(/|$)
   */
  twitter?: string | null;

  /**
   * @format uri
   * @pattern ^https?://([\w-]+\.)?pixiv\.net(/|$)
   */
  pixiv?: string | null;

  /**
   * @format uri
   * @pattern ^https?://([\w-]+\.)?melonbooks\.co\.jp(/|$)
   */
  melonBook?: string | null;

  /**
   * @format uri
   * @pattern ^https?://([\w-]+\.)?fanbox\.cc(/|$)
   */
  fanBox?: string | null;

  /**
   * @format uri
   * @pattern ^https?://([\w-]+\.)?booth\.pm(/|$)
   */
  booth?: string | null;

  /**
   * @format uri
   * @pattern ^https?://([\w-]+\.)?nicovideo\.jp(/|$)
   */
  nicoVideo?: string | null;

  /**
   * @format uri
   * @pattern ^https?://([\w-]+\.)?skeb\.jp(/|$)
   */
  skeb?: string | null;

  /**
   * @format uri
   * @pattern ^https?://([\w-]+\.)?fantia\.jp(/|$)
   */
  fantia?: string | null;

  /**
   * @format uri
   * @pattern ^https?://([\w-]+\.)?tumblr\.com(/|$)
   */
  tumblr?: string | null;

  /**
   * @format uri
   * @pattern ^https?://www\.youtube\.com(/|$)
   */
  youtube?: string | null;

  /**
   * @format uri
   * @pattern ^https?://([\w-]+\.)?weibo\.(cn|com)(/|$)
   */
  weibo?: string | null;

  /**
   * @format uri
   * @pattern ^https?://([\w-]+\.)?naver\.com(/|$)
   */
  naver?: string | null;

  /**
   * @format uri
   * @pattern ^https?://
   */
  website?: string | null;

  /** @min 1 */
  version?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthorEdit {
  name?: string;
  biography?: LocalizedString;

  /**
   * @format uri
   * @pattern ^https?://twitter\.com(/|$)
   */
  twitter?: string | null;

  /**
   * @format uri
   * @pattern ^https?://([\w-]+\.)?pixiv\.net(/|$)
   */
  pixiv?: string | null;

  /**
   * @format uri
   * @pattern ^https?://([\w-]+\.)?melonbooks\.co\.jp(/|$)
   */
  melonBook?: string | null;

  /**
   * @format uri
   * @pattern ^https?://([\w-]+\.)?fanbox\.cc(/|$)
   */
  fanBox?: string | null;

  /**
   * @format uri
   * @pattern ^https?://([\w-]+\.)?booth\.pm(/|$)
   */
  booth?: string | null;

  /**
   * @format uri
   * @pattern ^https?://([\w-]+\.)?nicovideo\.jp(/|$)
   */
  nicoVideo?: string | null;

  /**
   * @format uri
   * @pattern ^https?://([\w-]+\.)?skeb\.jp(/|$)
   */
  skeb?: string | null;

  /**
   * @format uri
   * @pattern ^https?://([\w-]+\.)?fantia\.jp(/|$)
   */
  fantia?: string | null;

  /**
   * @format uri
   * @pattern ^https?://([\w-]+\.)?tumblr\.com(/|$)
   */
  tumblr?: string | null;

  /**
   * @format uri
   * @pattern ^https?://www\.youtube\.com(/|$)
   */
  youtube?: string | null;

  /**
   * @format uri
   * @pattern ^https?://([\w-]+\.)?weibo\.(cn|com)(/|$)
   */
  weibo?: string | null;

  /**
   * @format uri
   * @pattern ^https?://([\w-]+\.)?naver\.com(/|$)
   */
  naver?: string | null;

  /**
   * @format uri
   * @pattern ^https?://
   */
  website?: string | null;

  /** @min 1 */
  version: number;
}

export interface AuthorCreate {
  name: string;
  biography?: LocalizedString;

  /**
   * @format uri
   * @pattern ^https?://twitter\.com(/|$)
   */
  twitter?: string | null;

  /**
   * @format uri
   * @pattern ^https?://([\w-]+\.)?pixiv\.net(/|$)
   */
  pixiv?: string | null;

  /**
   * @format uri
   * @pattern ^https?://([\w-]+\.)?melonbooks\.co\.jp(/|$)
   */
  melonBook?: string | null;

  /**
   * @format uri
   * @pattern ^https?://([\w-]+\.)?fanbox\.cc(/|$)
   */
  fanBox?: string | null;

  /**
   * @format uri
   * @pattern ^https?://([\w-]+\.)?booth\.pm(/|$)
   */
  booth?: string | null;

  /**
   * @format uri
   * @pattern ^https?://([\w-]+\.)?nicovideo\.jp(/|$)
   */
  nicoVideo?: string | null;

  /**
   * @format uri
   * @pattern ^https?://([\w-]+\.)?skeb\.jp(/|$)
   */
  skeb?: string | null;

  /**
   * @format uri
   * @pattern ^https?://([\w-]+\.)?fantia\.jp(/|$)
   */
  fantia?: string | null;

  /**
   * @format uri
   * @pattern ^https?://([\w-]+\.)?tumblr\.com(/|$)
   */
  tumblr?: string | null;

  /**
   * @format uri
   * @pattern ^https?://www\.youtube\.com(/|$)
   */
  youtube?: string | null;

  /**
   * @format uri
   * @pattern ^https?://([\w-]+\.)?weibo\.(cn|com)(/|$)
   */
  weibo?: string | null;

  /**
   * @format uri
   * @pattern ^https?://([\w-]+\.)?naver\.com(/|$)
   */
  naver?: string | null;

  /**
   * @format uri
   * @pattern ^https?://
   */
  website?: string | null;

  /** @min 1 */
  version?: number;
}

export interface MappingIdBody {
  type?: "group" | "manga" | "chapter" | "tag";
  ids?: number[];
}

export interface MappingIdResponse {
  result?: string;
  response?: string;
  data?: MappingId[];
  limit?: number;
  offset?: number;
  total?: number;
}

export interface MappingId {
  /** @format uuid */
  id?: string;
  type?: "mapping_id";
  attributes?: MappingIdAttributes;
  relationships?: Relationship[];
}

export interface MappingIdAttributes {
  type?: "manga" | "chapter" | "group" | "tag";
  legacyId?: number;

  /** @format uuid */
  newId?: string;
}

export interface TagResponse {
  result?: string;
  response?: string;
  data?: Tag[];
  limit?: number;
  offset?: number;
  total?: number;
}

export interface Tag {
  /** @format uuid */
  id?: string;
  type?: "tag";
  attributes?: TagAttributes;
  relationships?: Relationship[];
}

export interface TagAttributes {
  name?: LocalizedString;
  description?: LocalizedString;
  group?: string;

  /** @min 1 */
  version?: number;
}

export interface UserResponse {
  result?: "ok";
  response?: string;
  data?: User;
}

export interface SendAccountActivationCode {
  /** @format email */
  email: string;
}

export interface RecoverCompleteBody {
  newPassword: string;
}

export interface UpdateMangaStatus {
  status: "reading" | "on_hold" | "plan_to_read" | "dropped" | "re_reading" | "completed" | null;
}

export interface ChapterRequest {
  title?: string | null;
  volume?: string | null;
  chapter?: string | null;

  /** @pattern ^[a-z]{2}(-[a-z]{2})?$ */
  translatedLanguage?: string;
  groups?: string[];

  /** @min 1 */
  version?: number;
}

export interface CoverList {
  result?: string;
  response?: string;
  data?: Cover[];
  limit?: number;
  offset?: number;
  total?: number;
}

export interface AuthorList {
  result?: string;
  response?: string;
  data?: Author[];
  limit?: number;
  offset?: number;
  total?: number;
}

export interface ChapterList {
  result?: string;
  response?: string;
  data?: Chapter[];
  limit?: number;
  offset?: number;
  total?: number;
}

export interface ScanlationGroupList {
  result?: string;
  response?: string;
  data?: ScanlationGroup[];
  limit?: number;
  offset?: number;
  total?: number;
}

export type MangaRelationCreate = MangaRelationRequest;

export interface MangaRelationRequest {
  /** @format uuid */
  targetManga?: string;
  relation?:
    | "monochrome"
    | "main_story"
    | "adapted_from"
    | "based_on"
    | "prequel"
    | "side_story"
    | "doujinshi"
    | "same_franchise"
    | "shared_universe"
    | "sequel"
    | "spin_off"
    | "alternate_story"
    | "alternate_version"
    | "preserialization"
    | "colored"
    | "serialization";
}

export interface MangaRelationList {
  result?: string;
  response?: string;
  data?: MangaRelation[];
  limit?: number;
  offset?: number;
  total?: number;
}

export interface MangaRelationResponse {
  result?: "ok" | "error";
  response?: string;
  data?: MangaRelation;
}

export interface MangaRelation {
  /** @format uuid */
  id?: string;
  type?: "manga_relation";
  attributes?: MangaRelationAttributes;
  relationships?: Relationship[];
}

export interface MangaRelationAttributes {
  relation?:
    | "monochrome"
    | "main_story"
    | "adapted_from"
    | "based_on"
    | "prequel"
    | "side_story"
    | "doujinshi"
    | "same_franchise"
    | "shared_universe"
    | "sequel"
    | "spin_off"
    | "alternate_story"
    | "alternate_version"
    | "preserialization"
    | "colored"
    | "serialization";

  /** @min 1 */
  version?: number;
}

export interface MangaList {
  result?: string;
  response?: string;
  data?: Manga[];
  limit?: number;
  offset?: number;
  total?: number;
}

export interface CustomListList {
  result?: string;
  response?: string;
  data?: CustomList[];
  limit?: number;
  offset?: number;
  total?: number;
}

export interface UserList {
  result?: string;
  response?: string;
  data?: User[];
  limit?: number;
  offset?: number;
  total?: number;
}

export interface UploadSession {
  /** @format uuid */
  id?: string;
  type?: "upload_session";
  attributes?: UploadSessionAttributes;
}

export interface UploadSessionAttributes {
  isCommitted?: boolean;
  isProcessed?: boolean;
  isDeleted?: boolean;

  /** @min 1 */
  version?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UploadSessionFile {
  /** @format uuid */
  id?: string;
  type?: "upload_session_file";
  attributes?: UploadSessionFileAttributes;
}

export interface UploadSessionFileAttributes {
  originalFileName?: string;
  fileHash?: string;
  fileSize?: number;
  mimeType?: string;
  source?: "local" | "remote";

  /** @min 1 */
  version?: number;
}

export type ChapterReadMarkerBatch = (
  | { chapterIdsRead: string[] }
  | { chapterIdsUnread: string[] }
  | ({ chapterIdsRead: string[] } & { chapterIdsUnread: string[] })
) & { chapterIdsRead?: string[]; chapterIdsUnread?: string[] };

export interface BeginUploadSession {
  groups: string[];

  /** @format uuid */
  manga: string;
}

export interface BeginEditSession {
  /** @min 1 */
  version: number;
}

export interface CommitUploadSession {
  chapterDraft?: ChapterDraft;

  /** ordered list of Upload Session File ids */
  pageOrder?: string[];
}

export interface ChapterDraft {
  /** @pattern ^((0|[1-9]\d*)(\.\d+)?[a-z]?)?$ */
  volume: string | null;

  /** @pattern ^((0|[1-9]\d*)(\.\d+)?[a-z]?)?$ */
  chapter: string | null;
  title: string | null;

  /** @pattern ^[a-z]{2}(-[a-z]{2})?$ */
  translatedLanguage: string;

  /** @pattern ^https?:// */
  externalUrl?: string | null;

  /** @pattern ^\d{4}-[0-1]\d-([0-2]\d|3[0-1])T([0-1]\d|2[0-3]):[0-5]\d:[0-5]\d$ */
  publishAt?: string;
}

export interface ReportListResponse {
  result?: "ok" | "error";
  response?: string;
  data?: Report[];
  limit?: number;
  offset?: number;
  total?: number;
}

export interface Report {
  /** @format uuid */
  id?: string;
  type?: "report";
  attributes?: ReportAttributes;
  relationships?: Relationship[];
}

export interface ReportAttributes {
  details?: string;
  objectId?: string;
  status?: "waiting" | "accepted" | "refused" | "autoresolved";
  createdAt?: string;
}

export type ReferenceExpansion = (
  | "manga"
  | "chapter"
  | "cover_art"
  | "author"
  | "artist"
  | "scanlation_grouo"
  | "tag"
  | "user"
  | "custom_list"
)[];

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  ok: any;
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "https://api.mangadex.org";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
            ? JSON.stringify(property)
            : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
        ...(requestParams.headers || {}),
      },
      signal: cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response as unknown as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title MangaDex API
 * @version 5.6.1
 * @baseUrl https://api.mangadex.org
 * @contact MangaDex staff team <support@mangadex.org>
 *
 * MangaDex is an ad-free manga reader offering high-quality images!
 *
 * This document details our API as it is right now. It is in no way a promise to never change it, although we will endeavour to publicly notify any major change.
 *
 * # Acceptable use policy
 *
 * Usage of our services implies acceptance of the following:
 * - You **MUST** credit us
 * - You **MUST** credit scanlation groups if you offer the ability to read chapters
 * - You **CANNOT** run ads or paid services on your website and/or apps
 *
 * These may change at any time for any and no reason and it is up to you check for updates from time to time.
 *
 * # Security issues
 *
 * If you believe you found a security issue in our API, please check our [security.txt](/security.txt) to get in touch privately.
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  ping = {
    /**
     * No description
     *
     * @tags Infrastructure
     * @name PingList
     * @summary Ping the server
     * @request GET:/ping
     * @secure
     */
    pingList: (params: RequestParams = {}) =>
      this.request<string, any>({
        path: `/ping`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  manga = {
    /**
     * @description Search a list of Manga.
     *
     * @tags Manga
     * @name GetSearchManga
     * @summary Manga list
     * @request GET:/manga
     * @secure
     */
    getSearchManga: (
      query?: {
        limit?: number;
        offset?: number;
        title?: string;
        "authors[]"?: string[];
        "artists[]"?: string[];
        year?: number;
        "includedTags[]"?: string[];
        includedTagsMode?: "AND" | "OR";
        "excludedTags[]"?: string[];
        excludedTagsMode?: "AND" | "OR";
        "status[]"?: ("ongoing" | "completed" | "hiatus" | "cancelled")[];
        "originalLanguage[]"?: string[];
        "excludedOriginalLanguage[]"?: string[];
        "availableTranslatedLanguage[]"?: string[];
        "publicationDemographic[]"?: ("shounen" | "shoujo" | "josei" | "seinen" | "none")[];
        "ids[]"?: string[];
        "contentRating[]"?: ("safe" | "suggestive" | "erotica" | "pornographic")[];
        createdAtSince?: string;
        updatedAtSince?: string;
        order?: {
          title?: "asc" | "desc";
          year?: "asc" | "desc";
          createdAt?: "asc" | "desc";
          updatedAt?: "asc" | "desc";
          latestUploadedChapter?: "asc" | "desc";
          followedCount?: "asc" | "desc";
          relevance?: "asc" | "desc";
          rating?: "asc" | "desc";
        };
        "includes[]"?: (
          | "manga"
          | "chapter"
          | "cover_art"
          | "author"
          | "artist"
          | "scanlation_group"
          | "tag"
          | "user"
          | "custom_list"
        )[];
        hasAvailableChapters?: "0" | "1" | "true" | "false";
        group?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<MangaList, ErrorResponse>({
        path: `/manga`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Create a new Manga.
     *
     * @tags Manga
     * @name PostManga
     * @summary Create Manga
     * @request POST:/manga
     * @secure
     */
    postManga: (data: MangaCreate, params: RequestParams = {}) =>
      this.request<MangaResponse, ErrorResponse>({
        path: `/manga`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Manga
     * @name AggregateDetail
     * @summary Get Manga volumes & chapters
     * @request GET:/manga/{id}/aggregate
     * @secure
     */
    aggregateDetail: (
      id: string,
      query?: { "translatedLanguage[]"?: string[]; "groups[]"?: string[] },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          result?: string;
          volumes?: Record<
            string,
            {
              volume?: string;
              count?: number;
              chapters?: Record<string, { chapter?: string; id?: string; others?: string[]; count?: number }>;
            }
          >;
        },
        any
      >({
        path: `/manga/${id}/aggregate`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Get Manga.
     *
     * @tags Manga
     * @name GetMangaId
     * @summary Get Manga
     * @request GET:/manga/{id}
     * @secure
     */
    getMangaId: (id: string, query?: { "includes[]"?: string[] }, params: RequestParams = {}) =>
      this.request<MangaResponse, ErrorResponse>({
        path: `/manga/${id}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Manga
     * @name PutMangaId
     * @summary Update Manga
     * @request PUT:/manga/{id}
     * @secure
     */
    putMangaId: (
      id: string,
      data: MangaEdit & { artists?: string[]; authors?: string[] },
      params: RequestParams = {},
    ) =>
      this.request<MangaResponse, ErrorResponse>({
        path: `/manga/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Manga
     * @name DeleteMangaId
     * @summary Delete Manga
     * @request DELETE:/manga/{id}
     * @secure
     */
    deleteMangaId: (id: string, params: RequestParams = {}) =>
      this.request<Response, ErrorResponse>({
        path: `/manga/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags CustomList
     * @name PostMangaIdListListId
     * @summary Add Manga in CustomList
     * @request POST:/manga/{id}/list/{listId}
     * @secure
     */
    postMangaIdListListId: (id: string, listId: string, params: RequestParams = {}) =>
      this.request<Response, ErrorResponse>({
        path: `/manga/${id}/list/${listId}`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags CustomList
     * @name DeleteMangaIdListListId
     * @summary Remove Manga in CustomList
     * @request DELETE:/manga/{id}/list/{listId}
     * @secure
     */
    deleteMangaIdListListId: (id: string, listId: string, params: RequestParams = {}) =>
      this.request<Response, ErrorResponse>({
        path: `/manga/${id}/list/${listId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Manga
     * @name DeleteMangaIdFollow
     * @summary Unfollow Manga
     * @request DELETE:/manga/{id}/follow
     * @secure
     */
    deleteMangaIdFollow: (id: string, params: RequestParams = {}) =>
      this.request<Response, ErrorResponse>({
        path: `/manga/${id}/follow`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Manga
     * @name PostMangaIdFollow
     * @summary Follow Manga
     * @request POST:/manga/{id}/follow
     * @secure
     */
    postMangaIdFollow: (id: string, params: RequestParams = {}) =>
      this.request<Response, ErrorResponse>({
        path: `/manga/${id}/follow`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Manga
     * @name GetMangaIdFeed
     * @summary Manga feed
     * @request GET:/manga/{id}/feed
     * @secure
     */
    getMangaIdFeed: (
      id: string,
      query?: {
        limit?: number;
        offset?: number;
        "translatedLanguage[]"?: string[];
        "originalLanguage[]"?: string[];
        "excludedOriginalLanguage[]"?: string[];
        "contentRating[]"?: ("safe" | "suggestive" | "erotica" | "pornographic")[];
        "excludedGroups[]"?: string[];
        "excludedUploaders[]"?: string[];
        includeFutureUpdates?: "0" | "1";
        createdAtSince?: string;
        updatedAtSince?: string;
        publishAtSince?: string;
        order?: {
          createdAt?: "asc" | "desc";
          updatedAt?: "asc" | "desc";
          publishAt?: "asc" | "desc";
          readableAt?: "asc" | "desc";
          volume?: "asc" | "desc";
          chapter?: "asc" | "desc";
        };
        "includes[]"?: string[];
      },
      params: RequestParams = {},
    ) =>
      this.request<ChapterList, ErrorResponse>({
        path: `/manga/${id}/feed`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description A list of chapter ids that are marked as read for the specified manga
     *
     * @tags ChapterReadMarker
     * @name GetMangaChapterReadmarkers
     * @summary Manga read markers
     * @request GET:/manga/{id}/read
     * @secure
     */
    getMangaChapterReadmarkers: (id: string, params: RequestParams = {}) =>
      this.request<{ result?: "ok"; data?: string[] }, any>({
        path: `/manga/${id}/read`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Send a lot of chapter ids for one manga to mark as read and/or unread
     *
     * @tags ChapterReadMarker
     * @name PostMangaChapterReadmarkers
     * @summary Manga read markers batch
     * @request POST:/manga/{id}/read
     * @secure
     */
    postMangaChapterReadmarkers: (id: string, data: ChapterReadMarkerBatch, params: RequestParams = {}) =>
      this.request<{ result?: "ok" }, any>({
        path: `/manga/${id}/read`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description A list of chapter ids that are marked as read for the given manga ids
     *
     * @tags ChapterReadMarker
     * @name GetMangaChapterReadmarkers2
     * @summary Manga read markers
     * @request GET:/manga/read
     * @secure
     */
    getMangaChapterReadmarkers2: (query: { "ids[]": string[]; grouped?: boolean }, params: RequestParams = {}) =>
      this.request<{ result?: "ok"; data?: string[] | Record<string, string[]> }, any>({
        path: `/manga/read`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Manga
     * @name GetMangaRandom
     * @summary Get a random Manga
     * @request GET:/manga/random
     * @secure
     */
    getMangaRandom: (
      query?: { "includes[]"?: string[]; "contentRating[]"?: ("safe" | "suggestive" | "erotica" | "pornographic")[] },
      params: RequestParams = {},
    ) =>
      this.request<MangaResponse, any>({
        path: `/manga/random`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Manga
     * @name GetMangaTag
     * @summary Tag list
     * @request GET:/manga/tag
     * @secure
     */
    getMangaTag: (params: RequestParams = {}) =>
      this.request<TagResponse, any>({
        path: `/manga/tag`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Manga
     * @name GetMangaStatus
     * @summary Get all Manga reading status for logged User
     * @request GET:/manga/status
     * @secure
     */
    getMangaStatus: (
      query?: { status?: "reading" | "on_hold" | "plan_to_read" | "dropped" | "re_reading" | "completed" },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          result?: string;
          statuses?: Record<string, "reading" | "on_hold" | "plan_to_read" | "dropped" | "re_reading" | "completed">;
        },
        any
      >({
        path: `/manga/status`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Manga
     * @name GetMangaIdStatus
     * @summary Get a Manga reading status
     * @request GET:/manga/{id}/status
     * @secure
     */
    getMangaIdStatus: (id: string, params: RequestParams = {}) =>
      this.request<
        { result?: string; status?: "reading" | "on_hold" | "plan_to_read" | "dropped" | "re_reading" | "completed" },
        ErrorResponse
      >({
        path: `/manga/${id}/status`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Manga
     * @name PostMangaIdStatus
     * @summary Update Manga reading status
     * @request POST:/manga/{id}/status
     * @secure
     */
    postMangaIdStatus: (id: string, data: UpdateMangaStatus, params: RequestParams = {}) =>
      this.request<Response, ErrorResponse>({
        path: `/manga/${id}/status`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Manga
     * @name GetMangaIdDraft
     * @summary Get a specific Manga Draft
     * @request GET:/manga/draft/{id}
     * @secure
     */
    getMangaIdDraft: (id: string, query?: { "includes[]"?: string[] }, params: RequestParams = {}) =>
      this.request<MangaResponse, ErrorResponse>({
        path: `/manga/draft/${id}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Manga
     * @name CommitMangaDraft
     * @summary Submit a Manga Draft
     * @request POST:/manga/draft/{id}/commit
     * @secure
     */
    commitMangaDraft: (id: string, data: { version?: number }, params: RequestParams = {}) =>
      this.request<MangaResponse, ErrorResponse>({
        path: `/manga/draft/${id}/commit`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Manga
     * @name GetMangaDrafts
     * @summary Get a list of Manga Drafts
     * @request GET:/manga/draft
     * @secure
     */
    getMangaDrafts: (
      query?: {
        limit?: number;
        offset?: number;
        state?: "draft" | "submitted" | "rejected";
        order?: {
          title?: "asc" | "desc";
          year?: "asc" | "desc";
          createdAt?: "asc" | "desc";
          updatedAt?: "asc" | "desc";
        };
        "includes[]"?: string[];
      },
      params: RequestParams = {},
    ) =>
      this.request<MangaResponse, ErrorResponse>({
        path: `/manga/draft`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Manga
     * @name GetMangaRelation
     * @summary Manga relation list
     * @request GET:/manga/{mangaId}/relation
     * @secure
     */
    getMangaRelation: (mangaId: string, query?: { "includes[]"?: string[] }, params: RequestParams = {}) =>
      this.request<MangaRelationList, ErrorResponse>({
        path: `/manga/${mangaId}/relation`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Create a new Manga relation.
     *
     * @tags Manga
     * @name PostMangaRelation
     * @summary Create Manga relation
     * @request POST:/manga/{mangaId}/relation
     * @secure
     */
    postMangaRelation: (mangaId: string, data: MangaRelationCreate, params: RequestParams = {}) =>
      this.request<MangaRelationResponse, ErrorResponse>({
        path: `/manga/${mangaId}/relation`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Manga
     * @name DeleteMangaRelationId
     * @summary Delete Manga relation
     * @request DELETE:/manga/{mangaId}/relation/{id}
     * @secure
     */
    deleteMangaRelationId: (mangaId: string, id: string, params: RequestParams = {}) =>
      this.request<Response, ErrorResponse>({
        path: `/manga/${mangaId}/relation/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  auth = {
    /**
     * No description
     *
     * @tags Auth
     * @name PostAuthLogin
     * @summary Login
     * @request POST:/auth/login
     * @secure
     */
    postAuthLogin: (data: Login, params: RequestParams = {}) =>
      this.request<LoginResponse, ErrorResponse>({
        path: `/auth/login`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name GetAuthCheck
     * @summary Check token
     * @request GET:/auth/check
     * @secure
     */
    getAuthCheck: (params: RequestParams = {}) =>
      this.request<CheckResponse, any>({
        path: `/auth/check`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name PostAuthLogout
     * @summary Logout
     * @request POST:/auth/logout
     * @secure
     */
    postAuthLogout: (params: RequestParams = {}) =>
      this.request<LogoutResponse, ErrorResponse>({
        path: `/auth/logout`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name PostAuthRefresh
     * @summary Refresh token
     * @request POST:/auth/refresh
     * @secure
     */
    postAuthRefresh: (data: RefreshToken, params: RequestParams = {}) =>
      this.request<RefreshResponse, ErrorResponse>({
        path: `/auth/refresh`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  account = {
    /**
     * No description
     *
     * @tags Account
     * @name GetAccountAvailable
     * @summary Account username available
     * @request GET:/account/available
     * @secure
     */
    getAccountAvailable: (query: { username: string }, params: RequestParams = {}) =>
      this.request<{ available?: boolean }, ErrorResponse>({
        path: `/account/available`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name PostAccountCreate
     * @summary Create Account
     * @request POST:/account/create
     * @secure
     */
    postAccountCreate: (data: CreateAccount, params: RequestParams = {}) =>
      this.request<UserResponse, ErrorResponse>({
        path: `/account/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name GetAccountActivateCode
     * @summary Activate account
     * @request POST:/account/activate/{code}
     * @secure
     */
    getAccountActivateCode: (code: string, params: RequestParams = {}) =>
      this.request<AccountActivateResponse, ErrorResponse>({
        path: `/account/activate/${code}`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name PostAccountActivateResend
     * @summary Resend Activation code
     * @request POST:/account/activate/resend
     * @secure
     */
    postAccountActivateResend: (data: SendAccountActivationCode, params: RequestParams = {}) =>
      this.request<AccountActivateResponse, ErrorResponse>({
        path: `/account/activate/resend`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description You can only request Account Recovery once per Hour for the same Email Address
     *
     * @tags Account
     * @name PostAccountRecover
     * @summary Recover given Account
     * @request POST:/account/recover
     * @secure
     */
    postAccountRecover: (data: SendAccountActivationCode, params: RequestParams = {}) =>
      this.request<AccountActivateResponse, ErrorResponse>({
        path: `/account/recover`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name PostAccountRecoverCode
     * @summary Complete Account recover
     * @request POST:/account/recover/{code}
     * @secure
     */
    postAccountRecoverCode: (code: string, data: RecoverCompleteBody, params: RequestParams = {}) =>
      this.request<AccountActivateResponse, ErrorResponse>({
        path: `/account/recover/${code}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  group = {
    /**
     * No description
     *
     * @tags ScanlationGroup
     * @name GetSearchGroup
     * @summary Scanlation Group list
     * @request GET:/group
     * @secure
     */
    getSearchGroup: (
      query?: {
        limit?: number;
        offset?: number;
        "ids[]"?: string[];
        name?: string;
        focusedLanguage?: string;
        "includes[]"?: string[];
        order?: {
          name?: "asc" | "desc";
          createdAt?: "asc" | "desc";
          updatedAt?: "asc" | "desc";
          followedCount?: "asc" | "desc";
          relevance?: "asc" | "desc";
        };
      },
      params: RequestParams = {},
    ) =>
      this.request<ScanlationGroupList, ErrorResponse>({
        path: `/group`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ScanlationGroup
     * @name PostGroup
     * @summary Create Scanlation Group
     * @request POST:/group
     * @secure
     */
    postGroup: (data: CreateScanlationGroup, params: RequestParams = {}) =>
      this.request<ScanlationGroupResponse, ErrorResponse>({
        path: `/group`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ScanlationGroup
     * @name GetGroupId
     * @summary Get Scanlation Group
     * @request GET:/group/{id}
     * @secure
     */
    getGroupId: (id: string, query?: { "includes[]"?: string[] }, params: RequestParams = {}) =>
      this.request<ScanlationGroupResponse, ErrorResponse>({
        path: `/group/${id}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ScanlationGroup
     * @name PutGroupId
     * @summary Update Scanlation Group
     * @request PUT:/group/{id}
     * @secure
     */
    putGroupId: (id: string, data: ScanlationGroupEdit, params: RequestParams = {}) =>
      this.request<ScanlationGroupResponse, ErrorResponse>({
        path: `/group/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ScanlationGroup
     * @name DeleteGroupId
     * @summary Delete Scanlation Group
     * @request DELETE:/group/{id}
     * @secure
     */
    deleteGroupId: (id: string, params: RequestParams = {}) =>
      this.request<Response, ErrorResponse>({
        path: `/group/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ScanlationGroup
     * @name PostGroupIdFollow
     * @summary Follow Scanlation Group
     * @request POST:/group/{id}/follow
     * @secure
     */
    postGroupIdFollow: (id: string, params: RequestParams = {}) =>
      this.request<Response, ErrorResponse>({
        path: `/group/${id}/follow`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ScanlationGroup
     * @name DeleteGroupIdFollow
     * @summary Unfollow Scanlation Group
     * @request DELETE:/group/{id}/follow
     * @secure
     */
    deleteGroupIdFollow: (id: string, params: RequestParams = {}) =>
      this.request<Response, ErrorResponse>({
        path: `/group/${id}/follow`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  list = {
    /**
     * No description
     *
     * @tags CustomList
     * @name PostList
     * @summary Create CustomList
     * @request POST:/list
     * @secure
     */
    postList: (data: CustomListCreate, params: RequestParams = {}) =>
      this.request<CustomListResponse, ErrorResponse>({
        path: `/list`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags CustomList
     * @name GetListId
     * @summary Get CustomList
     * @request GET:/list/{id}
     * @secure
     */
    getListId: (id: string, params: RequestParams = {}) =>
      this.request<CustomListResponse, ErrorResponse>({
        path: `/list/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description The size of the body is limited to 8KB.
     *
     * @tags CustomList
     * @name PutListId
     * @summary Update CustomList
     * @request PUT:/list/{id}
     * @secure
     */
    putListId: (id: string, data: CustomListEdit, params: RequestParams = {}) =>
      this.request<CustomListResponse, ErrorResponse>({
        path: `/list/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags CustomList
     * @name DeleteListId
     * @summary Delete CustomList
     * @request DELETE:/list/{id}
     * @secure
     */
    deleteListId: (id: string, params: RequestParams = {}) =>
      this.request<Response, ErrorResponse>({
        path: `/list/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description The request body is empty
     *
     * @tags CustomList
     * @name FollowListId
     * @summary Follow CustomList
     * @request POST:/list/{id}/follow
     * @secure
     */
    followListId: (id: string, data: object, params: RequestParams = {}) =>
      this.request<{ result?: "ok" }, ErrorResponse>({
        path: `/list/${id}/follow`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description The request body is empty
     *
     * @tags CustomList
     * @name UnfollowListId
     * @summary Unfollow CustomList
     * @request DELETE:/list/{id}/follow
     * @secure
     */
    unfollowListId: (id: string, data: object, params: RequestParams = {}) =>
      this.request<{ result?: "ok" }, ErrorResponse>({
        path: `/list/${id}/follow`,
        method: "DELETE",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Feed
     * @name GetListIdFeed
     * @summary CustomList Manga feed
     * @request GET:/list/{id}/feed
     * @secure
     */
    getListIdFeed: (
      id: string,
      query?: {
        limit?: number;
        offset?: number;
        "translatedLanguage[]"?: string[];
        "originalLanguage[]"?: string[];
        "excludedOriginalLanguage[]"?: string[];
        "contentRating[]"?: ("safe" | "suggestive" | "erotica" | "pornographic")[];
        "excludedGroups[]"?: string[];
        "excludedUploaders[]"?: string[];
        includeFutureUpdates?: "0" | "1";
        createdAtSince?: string;
        updatedAtSince?: string;
        publishAtSince?: string;
        order?: {
          createdAt?: "asc" | "desc";
          updatedAt?: "asc" | "desc";
          publishAt?: "asc" | "desc";
          readableAt?: "asc" | "desc";
          volume?: "asc" | "desc";
          chapter?: "asc" | "desc";
        };
        "includes[]"?: string[];
      },
      params: RequestParams = {},
    ) =>
      this.request<ChapterList, ErrorResponse>({
        path: `/list/${id}/feed`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  user = {
    /**
     * @description This will list public and private CustomList
     *
     * @tags CustomList
     * @name GetUserList
     * @summary Get logged User CustomList list
     * @request GET:/user/list
     * @secure
     */
    getUserList: (query?: { limit?: number; offset?: number }, params: RequestParams = {}) =>
      this.request<CustomListList, any>({
        path: `/user/list`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description This will list only public CustomList
     *
     * @tags CustomList
     * @name GetUserIdList
     * @summary Get User's CustomList list
     * @request GET:/user/{id}/list
     * @secure
     */
    getUserIdList: (id: string, query?: { limit?: number; offset?: number }, params: RequestParams = {}) =>
      this.request<CustomListList, any>({
        path: `/user/${id}/list`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name GetUser
     * @summary User list
     * @request GET:/user
     * @secure
     */
    getUser: (
      query?: {
        limit?: number;
        offset?: number;
        "ids[]"?: string[];
        username?: string;
        order?: { username?: "asc" | "desc" };
      },
      params: RequestParams = {},
    ) =>
      this.request<UserList, any>({
        path: `/user`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name GetUserId
     * @summary Get User
     * @request GET:/user/{id}
     * @secure
     */
    getUserId: (id: string, params: RequestParams = {}) =>
      this.request<UserResponse, any>({
        path: `/user/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name DeleteUserId
     * @summary Delete User
     * @request DELETE:/user/{id}
     * @secure
     */
    deleteUserId: (id: string, params: RequestParams = {}) =>
      this.request<Response, any>({
        path: `/user/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name PostUserDeleteCode
     * @summary Approve User deletion
     * @request POST:/user/delete/{code}
     * @secure
     */
    postUserDeleteCode: (code: string, params: RequestParams = {}) =>
      this.request<Response, any>({
        path: `/user/delete/${code}`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name PostUserPassword
     * @summary Update User password
     * @request POST:/user/password
     * @secure
     */
    postUserPassword: (data: { oldPassword: string; newPassword: string }, params: RequestParams = {}) =>
      this.request<Response, any>({
        path: `/user/password`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name PostUserEmail
     * @summary Update User email
     * @request POST:/user/email
     * @secure
     */
    postUserEmail: (data: { email: string }, params: RequestParams = {}) =>
      this.request<Response, any>({
        path: `/user/email`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Feed
     * @name GetUserFollowsMangaFeed
     * @summary Get logged User followed Manga feed (Chapter list)
     * @request GET:/user/follows/manga/feed
     * @secure
     */
    getUserFollowsMangaFeed: (
      query?: {
        limit?: number;
        offset?: number;
        "translatedLanguage[]"?: string[];
        "originalLanguage[]"?: string[];
        "excludedOriginalLanguage[]"?: string[];
        "contentRating[]"?: ("safe" | "suggestive" | "erotica" | "pornographic")[];
        "excludedGroups[]"?: string[];
        "excludedUploaders[]"?: string[];
        includeFutureUpdates?: "0" | "1";
        createdAtSince?: string;
        updatedAtSince?: string;
        publishAtSince?: string;
        order?: {
          createdAt?: "asc" | "desc";
          updatedAt?: "asc" | "desc";
          publishAt?: "asc" | "desc";
          readableAt?: "asc" | "desc";
          volume?: "asc" | "desc";
          chapter?: "asc" | "desc";
        };
        "includes[]"?: string[];
      },
      params: RequestParams = {},
    ) =>
      this.request<ChapterList, ErrorResponse>({
        path: `/user/follows/manga/feed`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name GetUserMe
     * @summary Logged User details
     * @request GET:/user/me
     * @secure
     */
    getUserMe: (params: RequestParams = {}) =>
      this.request<UserResponse, any>({
        path: `/user/me`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Follows
     * @name GetUserFollowsGroup
     * @summary Get logged User followed Groups
     * @request GET:/user/follows/group
     * @secure
     */
    getUserFollowsGroup: (
      query?: { limit?: number; offset?: number; "includes[]"?: string[] },
      params: RequestParams = {},
    ) =>
      this.request<ScanlationGroupList, any>({
        path: `/user/follows/group`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Follows
     * @name GetUserFollowsGroupId
     * @summary Check if logged User follows a Group
     * @request GET:/user/follows/group/{id}
     * @secure
     */
    getUserFollowsGroupId: (id: string, params: RequestParams = {}) =>
      this.request<Response, Response>({
        path: `/user/follows/group/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Follows
     * @name GetUserFollowsUser
     * @summary Get logged User followed User list
     * @request GET:/user/follows/user
     * @secure
     */
    getUserFollowsUser: (query?: { limit?: number; offset?: number }, params: RequestParams = {}) =>
      this.request<UserList, any>({
        path: `/user/follows/user`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Follows
     * @name GetUserFollowsUserId
     * @summary Check if logged User follows a User
     * @request GET:/user/follows/user/{id}
     * @secure
     */
    getUserFollowsUserId: (id: string, params: RequestParams = {}) =>
      this.request<Response, Response>({
        path: `/user/follows/user/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Follows
     * @name GetUserFollowsManga
     * @summary Get logged User followed Manga list
     * @request GET:/user/follows/manga
     * @secure
     */
    getUserFollowsManga: (
      query?: { limit?: number; offset?: number; "includes[]"?: string[] },
      params: RequestParams = {},
    ) =>
      this.request<MangaList, any>({
        path: `/user/follows/manga`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Follows
     * @name GetUserFollowsMangaId
     * @summary Check if logged User follows a Manga
     * @request GET:/user/follows/manga/{id}
     * @secure
     */
    getUserFollowsMangaId: (id: string, params: RequestParams = {}) =>
      this.request<Response, Response>({
        path: `/user/follows/manga/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Follows
     * @name GetUserFollowsList
     * @summary Get logged User followed CustomList list
     * @request GET:/user/follows/list
     * @secure
     */
    getUserFollowsList: (query?: { limit?: number; offset?: number }, params: RequestParams = {}) =>
      this.request<CustomListList, any>({
        path: `/user/follows/list`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Follows
     * @name GetUserFollowsListId
     * @summary Check if logged User follows a CustomList
     * @request GET:/user/follows/list/{id}
     * @secure
     */
    getUserFollowsListId: (id: string, params: RequestParams = {}) =>
      this.request<Response, Response>({
        path: `/user/follows/list/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ChapterReadMarker
     * @name GetReadingHistory
     * @summary Get users reading history
     * @request GET:/user/history
     * @secure
     */
    getReadingHistory: (params: RequestParams = {}) =>
      this.request<{ result?: string; ratings?: { chapterId?: string; readDate?: string }[] }, ErrorResponse>({
        path: `/user/history`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  chapter = {
    /**
     * @description Chapter list. If you want the Chapters of a given Manga, please check the feed endpoints.
     *
     * @tags Chapter
     * @name GetChapter
     * @summary Chapter list
     * @request GET:/chapter
     * @secure
     */
    getChapter: (
      query?: {
        limit?: number;
        offset?: number;
        "ids[]"?: string[];
        title?: string;
        "groups[]"?: string[];
        uploader?: string | string[];
        manga?: string;
        "volume[]"?: string | string[];
        chapter?: string | string[];
        "translatedLanguage[]"?: string[];
        "originalLanguage[]"?: string[];
        "excludedOriginalLanguage[]"?: string[];
        "contentRating[]"?: ("safe" | "suggestive" | "erotica" | "pornographic")[];
        "excludedGroups[]"?: string[];
        "excludedUploaders[]"?: string[];
        includeFutureUpdates?: "0" | "1";
        createdAtSince?: string;
        updatedAtSince?: string;
        publishAtSince?: string;
        order?: {
          createdAt?: "asc" | "desc";
          updatedAt?: "asc" | "desc";
          publishAt?: "asc" | "desc";
          readableAt?: "asc" | "desc";
          volume?: "asc" | "desc";
          chapter?: "asc" | "desc";
        };
        includes?: string[];
      },
      params: RequestParams = {},
    ) =>
      this.request<ChapterList, ErrorResponse>({
        path: `/chapter`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Chapter
     * @name GetChapterId
     * @summary Get Chapter
     * @request GET:/chapter/{id}
     * @secure
     */
    getChapterId: (id: string, query?: { "includes[]"?: string[] }, params: RequestParams = {}) =>
      this.request<ChapterResponse, ErrorResponse>({
        path: `/chapter/${id}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Chapter
     * @name PutChapterId
     * @summary Update Chapter
     * @request PUT:/chapter/{id}
     * @secure
     */
    putChapterId: (id: string, data: ChapterEdit, params: RequestParams = {}) =>
      this.request<ChapterResponse, ErrorResponse>({
        path: `/chapter/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Chapter
     * @name DeleteChapterId
     * @summary Delete Chapter
     * @request DELETE:/chapter/{id}
     * @secure
     */
    deleteChapterId: (id: string, params: RequestParams = {}) =>
      this.request<Response, ErrorResponse>({
        path: `/chapter/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Mark chapter as read for the current user
     *
     * @tags ChapterReadMarker
     * @name ChapterIdRead
     * @summary Mark Chapter read
     * @request POST:/chapter/{id}/read
     * @secure
     */
    chapterIdRead: (id: string, query?: { updateHistory?: boolean }, params: RequestParams = {}) =>
      this.request<{ result?: "ok" | "error" }, ErrorResponse>({
        path: `/chapter/${id}/read`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Mark chapter as unread for the current user
     *
     * @tags ChapterReadMarker
     * @name ChapterIdUnread
     * @summary Mark Chapter unread
     * @request DELETE:/chapter/{id}/read
     * @secure
     */
    chapterIdUnread: (id: string, params: RequestParams = {}) =>
      this.request<{ result?: "ok" | "error" }, ErrorResponse>({
        path: `/chapter/${id}/read`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  cover = {
    /**
     * No description
     *
     * @tags Cover
     * @name GetCover
     * @summary CoverArt list
     * @request GET:/cover
     * @secure
     */
    getCover: (
      query?: {
        limit?: number;
        offset?: number;
        "manga[]"?: string[];
        "ids[]"?: string[];
        "uploaders[]"?: string[];
        "locales[]"?: string[];
        order?: { createdAt?: "asc" | "desc"; updatedAt?: "asc" | "desc"; volume?: "asc" | "desc" };
        "includes[]"?: string[];
      },
      params: RequestParams = {},
    ) =>
      this.request<CoverList, ErrorResponse>({
        path: `/cover`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Cover
     * @name UploadCover
     * @summary Upload Cover
     * @request POST:/cover/{mangaOrCoverId}
     * @secure
     */
    uploadCover: (
      mangaOrCoverId: string,
      data: { file?: File; volume?: string | null; description?: string; locale?: string },
      params: RequestParams = {},
    ) =>
      this.request<CoverResponse, ErrorResponse>({
        path: `/cover/${mangaOrCoverId}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Cover
     * @name GetCoverId
     * @summary Get Cover
     * @request GET:/cover/{mangaOrCoverId}
     * @secure
     */
    getCoverId: (mangaOrCoverId: string, query?: { "includes[]"?: string[] }, params: RequestParams = {}) =>
      this.request<CoverResponse, ErrorResponse>({
        path: `/cover/${mangaOrCoverId}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Cover
     * @name EditCover
     * @summary Edit Cover
     * @request PUT:/cover/{mangaOrCoverId}
     * @secure
     */
    editCover: (mangaOrCoverId: string, data: CoverEdit, params: RequestParams = {}) =>
      this.request<CoverResponse, ErrorResponse>({
        path: `/cover/${mangaOrCoverId}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Cover
     * @name DeleteCover
     * @summary Delete Cover
     * @request DELETE:/cover/{mangaOrCoverId}
     * @secure
     */
    deleteCover: (mangaOrCoverId: string, params: RequestParams = {}) =>
      this.request<Response, ErrorResponse>({
        path: `/cover/${mangaOrCoverId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  author = {
    /**
     * No description
     *
     * @tags Author
     * @name GetAuthor
     * @summary Author list
     * @request GET:/author
     * @secure
     */
    getAuthor: (
      query?: {
        limit?: number;
        offset?: number;
        "ids[]"?: string[];
        name?: string;
        order?: { name?: "asc" | "desc" };
        "includes[]"?: string[];
      },
      params: RequestParams = {},
    ) =>
      this.request<AuthorList, ErrorResponse>({
        path: `/author`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Author
     * @name PostAuthor
     * @summary Create Author
     * @request POST:/author
     * @secure
     */
    postAuthor: (data: AuthorCreate, params: RequestParams = {}) =>
      this.request<AuthorResponse, ErrorResponse>({
        path: `/author`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Author
     * @name GetAuthorId
     * @summary Get Author
     * @request GET:/author/{id}
     * @secure
     */
    getAuthorId: (id: string, query?: { "includes[]"?: string[] }, params: RequestParams = {}) =>
      this.request<AuthorResponse, ErrorResponse>({
        path: `/author/${id}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Author
     * @name PutAuthorId
     * @summary Update Author
     * @request PUT:/author/{id}
     * @secure
     */
    putAuthorId: (id: string, data: AuthorEdit, params: RequestParams = {}) =>
      this.request<AuthorResponse, ErrorResponse>({
        path: `/author/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Author
     * @name DeleteAuthorId
     * @summary Delete Author
     * @request DELETE:/author/{id}
     * @secure
     */
    deleteAuthorId: (id: string, params: RequestParams = {}) =>
      this.request<Response, ErrorResponse>({
        path: `/author/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  legacy = {
    /**
     * No description
     *
     * @tags Legacy
     * @name PostLegacyMapping
     * @summary Legacy ID mapping
     * @request POST:/legacy/mapping
     * @secure
     */
    postLegacyMapping: (data: MappingIdBody, params: RequestParams = {}) =>
      this.request<MappingIdResponse, ErrorResponse>({
        path: `/legacy/mapping`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  atHome = {
    /**
     * No description
     *
     * @tags AtHome
     * @name GetAtHomeServerChapterId
     * @summary Get MangaDex@Home server URL
     * @request GET:/at-home/server/{chapterId}
     * @secure
     */
    getAtHomeServerChapterId: (chapterId: string, query?: { forcePort443?: boolean }, params: RequestParams = {}) =>
      this.request<
        { result?: string; baseUrl?: string; chapter?: { hash?: string; data?: string[]; dataSaver?: string[] } },
        ErrorResponse
      >({
        path: `/at-home/server/${chapterId}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  captcha = {
    /**
     * @description Captchas can be solved explicitly through this endpoint, another way is to add a `X-Captcha-Result` header to any request. The same logic will verify the captcha and is probably more convenient because it takes one less request. Authentication is optional. Captchas are tracked for both the client ip and for the user id, if you are logged in you want to send your session token but that is not required.
     *
     * @tags Captcha
     * @name PostCaptchaSolve
     * @summary Solve Captcha
     * @request POST:/captcha/solve
     * @secure
     */
    postCaptchaSolve: (data: { captchaChallenge: string }, params: RequestParams = {}) =>
      this.request<{ result?: "ok" | "error" }, ErrorResponse>({
        path: `/captcha/solve`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  report = {
    /**
     * No description
     *
     * @tags Report
     * @name GetReportReasonsByCategory
     * @summary Get a list of report reasons
     * @request GET:/report/reasons/{category}
     * @secure
     */
    getReportReasonsByCategory: (
      category: "manga" | "chapter" | "scanlation_group" | "user" | "author",
      params: RequestParams = {},
    ) =>
      this.request<
        {
          result?: string;
          response?: string;
          data?: {
            id?: string;
            type?: string;
            attributes?: {
              reason?: LocalizedString;
              detailsRequired?: boolean;
              category?: "manga" | "chapter" | "scanlation_group" | "user" | "author";
              version?: number;
            };
          }[];
          limit?: number;
          offset?: number;
          total?: number;
        },
        ErrorResponse
      >({
        path: `/report/reasons/${category}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Report
     * @name GetReports
     * @summary Get a list of reports by the user
     * @request GET:/report
     * @secure
     */
    getReports: (
      query?: {
        limit?: number;
        offset?: number;
        category?: "manga" | "chapter" | "scanlation_group" | "user" | "author";
        status?: "waiting" | "accepted" | "refused" | "autoresolved";
        order?: { createdAt?: "asc" | "desc" };
      },
      params: RequestParams = {},
    ) =>
      this.request<ReportListResponse, ErrorResponse>({
        path: `/report`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Report
     * @name PostReport
     * @summary Create a new Report
     * @request POST:/report
     * @secure
     */
    postReport: (
      data: {
        category?: "manga" | "chapter" | "user" | "scanlation_group" | "author";
        reason?: string;
        objectId?: string;
        details?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Response, ErrorResponse>({
        path: `/report`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  upload = {
    /**
     * No description
     *
     * @tags Upload
     * @name GetUploadSession
     * @summary Get the current User upload session
     * @request GET:/upload
     * @secure
     */
    getUploadSession: (params: RequestParams = {}) =>
      this.request<UploadSession, ErrorResponse>({
        path: `/upload`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Upload
     * @name BeginUploadSession
     * @summary Start an upload session
     * @request POST:/upload/begin
     * @secure
     */
    beginUploadSession: (data: BeginUploadSession, params: RequestParams = {}) =>
      this.request<UploadSession, any>({
        path: `/upload/begin`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Upload
     * @name BeginEditSession
     * @summary Start an edit chapter session
     * @request POST:/upload/begin/{chapterId}
     * @secure
     */
    beginEditSession: (chapterId: string, data: BeginEditSession, params: RequestParams = {}) =>
      this.request<UploadSession, ErrorResponse>({
        path: `/upload/begin/${chapterId}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Upload
     * @name PutUploadSessionFile
     * @summary Upload images to the upload session
     * @request POST:/upload/{uploadSessionId}
     * @secure
     */
    putUploadSessionFile: (uploadSessionId: string, data: { file?: File }, params: RequestParams = {}) =>
      this.request<{ result?: "ok" | "error"; errors?: Error[]; data?: UploadSessionFile[] }, ErrorResponse>({
        path: `/upload/${uploadSessionId}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Upload
     * @name AbandonUploadSession
     * @summary Abandon upload session
     * @request DELETE:/upload/{uploadSessionId}
     * @secure
     */
    abandonUploadSession: (uploadSessionId: string, params: RequestParams = {}) =>
      this.request<Response, any>({
        path: `/upload/${uploadSessionId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Upload
     * @name CommitUploadSession
     * @summary Commit the upload session and specify chapter data
     * @request POST:/upload/{uploadSessionId}/commit
     * @secure
     */
    commitUploadSession: (uploadSessionId: string, data: CommitUploadSession, params: RequestParams = {}) =>
      this.request<Chapter, any>({
        path: `/upload/${uploadSessionId}/commit`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Upload
     * @name DeleteUploadedSessionFile
     * @summary Delete an uploaded image from the Upload Session
     * @request DELETE:/upload/{uploadSessionId}/{uploadSessionFileId}
     * @secure
     */
    deleteUploadedSessionFile: (uploadSessionId: string, uploadSessionFileId: string, params: RequestParams = {}) =>
      this.request<Response, any>({
        path: `/upload/${uploadSessionId}/${uploadSessionFileId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Upload
     * @name DeleteUploadedSessionFiles
     * @summary Delete a set of uploaded images from the Upload Session
     * @request DELETE:/upload/{uploadSessionId}/batch
     * @secure
     */
    deleteUploadedSessionFiles: (uploadSessionId: string, data: string[], params: RequestParams = {}) =>
      this.request<Response, any>({
        path: `/upload/${uploadSessionId}/batch`,
        method: "DELETE",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  rating = {
    /**
     * No description
     *
     * @tags Rating
     * @name GetRating
     * @summary Get your ratings
     * @request GET:/rating
     * @secure
     */
    getRating: (query: { manga: string[] }, params: RequestParams = {}) =>
      this.request<
        { result?: string; ratings?: Record<string, { rating?: number; createdAt?: string }> },
        ErrorResponse
      >({
        path: `/rating`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Rating
     * @name PostRatingMangaId
     * @summary Create or update Manga rating
     * @request POST:/rating/{mangaId}
     * @secure
     */
    postRatingMangaId: (mangaId: string, data: { rating?: number }, params: RequestParams = {}) =>
      this.request<Response, ErrorResponse>({
        path: `/rating/${mangaId}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Rating
     * @name DeleteRatingMangaId
     * @summary Delete Manga rating
     * @request DELETE:/rating/{mangaId}
     * @secure
     */
    deleteRatingMangaId: (mangaId: string, params: RequestParams = {}) =>
      this.request<Response, ErrorResponse>({
        path: `/rating/${mangaId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  statistics = {
    /**
     * No description
     *
     * @tags Statistics
     * @name GetStatisticsMangaUuid
     * @summary Get statistics about given Manga
     * @request GET:/statistics/manga/{uuid}
     * @secure
     */
    getStatisticsMangaUuid: (uuid: string, params: RequestParams = {}) =>
      this.request<
        {
          result?: string;
          statistics?: Record<
            string,
            {
              rating?: {
                average?: number | null;
                bayesian?: number;
                distribution?: {
                  "1"?: number;
                  "2"?: number;
                  "3"?: number;
                  "4"?: number;
                  "5"?: number;
                  "6"?: number;
                  "7"?: number;
                  "8"?: number;
                  "9"?: number;
                  "10"?: number;
                };
              };
              follows?: number;
            }
          >;
        },
        any
      >({
        path: `/statistics/manga/${uuid}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Statistics
     * @name GetStatisticsManga
     * @summary Find statistics about given Manga
     * @request GET:/statistics/manga
     * @secure
     */
    getStatisticsManga: (query: { manga: string[] }, params: RequestParams = {}) =>
      this.request<
        {
          result?: string;
          statistics?: Record<string, { rating?: { average?: number | null; bayesian?: number }; follows?: number }>;
        },
        any
      >({
        path: `/statistics/manga`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  settings = {
    /**
     * No description
     *
     * @tags Settings
     * @name GetSettingsTemplate
     * @summary Get latest Settings template
     * @request GET:/settings/template
     * @secure
     */
    getSettingsTemplate: (params: RequestParams = {}) =>
      this.request<object, ErrorResponse>({
        path: `/settings/template`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Settings
     * @name PostSettingsTemplate
     * @summary Create Settings template
     * @request POST:/settings/template
     * @secure
     */
    postSettingsTemplate: (data: object, params: RequestParams = {}) =>
      this.request<object, ErrorResponse>({
        path: `/settings/template`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Settings
     * @name GetSettingsTemplateVersion
     * @summary Get Settings template by version id
     * @request GET:/settings/template/{version}
     * @secure
     */
    getSettingsTemplateVersion: (version: string, params: RequestParams = {}) =>
      this.request<object, ErrorResponse>({
        path: `/settings/template/${version}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Settings
     * @name GetSettings
     * @summary Get an User Settings
     * @request GET:/settings
     * @secure
     */
    getSettings: (params: RequestParams = {}) =>
      this.request<{ result?: string; updatedAt?: string; settings?: object; template?: string }, ErrorResponse>({
        path: `/settings`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Settings
     * @name PostSettings
     * @summary Create or update an User Settings
     * @request POST:/settings
     * @secure
     */
    postSettings: (data: { settings?: object; updatedAt?: string }, params: RequestParams = {}) =>
      this.request<{ result?: string; updatedAt?: string; settings?: object; template?: string }, ErrorResponse>({
        path: `/settings`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
