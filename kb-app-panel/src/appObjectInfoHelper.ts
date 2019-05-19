
export interface AppObjectInfo {
    app_type: string;  // app_type
    authors: Array<string>;  // authors
    categories: Array<string>;  // categories
    git_commit_hash: string;  // git_commit_hash
    icon: {url: string};  // icon
    id: string;  // id
    input_types: Array<string>;  // input_types
    module_name: string;  // module_name
    name: string;  // name
    namespace: string;  // namespace
    output_types: Array<string>; // output_typess
    short_input_types: Array<string>; // short_input_types
    short_output_types: Array<string>; // short_output_types
    subtitle: string; // subtitle
    tooltip: string; // tooltip
    ver: string; // ver
}
