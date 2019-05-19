/*
example app_info:
app_type: "app"
authors: ["tgu2"]
categories: (2) ["active", "expression"]
git_commit_hash: "9ed177b4d33854e1e94b31da60726cb058b7a9cf"
icon: {url: "img?method_id=FeatureSetUtils/compute_average_expr…_matrix&image_name=kb_expr-yellow.png&tag=release"}
id: "FeatureSetUtils/compute_average_expression_matrix"
input_types: ["KBaseFeatureValues.ExpressionMatrix"]
module_name: "FeatureSetUtils"
name: "Create Average ExpressionMatrix"
namespace: "FeatureSetUtils"
output_types: []
short_input_types: ["ExpressionMatrix"]
short_output_types: []
subtitle: "Create an average ExpressionMatrix data object with one column per condition."
tooltip: "Create an average ExpressionMatrix data object with one column per condition."
ver: "1.2.5"
*/
// export interface AppObjectInfo {
//     0: string;  // app_type
//     1: Array<string>;  // authors
//     2: Array<string>;  // categories
//     3: string;  // git_commit_hash
//     4: {url: string};  // icon
//     5: string;  // id
//     6: Array<string>;  // input_types
//     7: string;  // module_name
//     8: string;  // name
//     9: string;  // namespace
//     10: Array<string>; // output_typess
//     11: Array<string>; // short_input_types
//     12: Array<string>; // short_output_types
//     13: string; // subtitle
//     14: string; // tooltip
//     15: string; // ver
// }

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
