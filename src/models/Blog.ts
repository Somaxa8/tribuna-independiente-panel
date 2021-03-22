import {JsonObject, JsonProperty} from "json2typescript";
import Document from "@/models/Document";

@JsonObject("Blog")
export default class Blog {

    @JsonProperty("id", Number, true)
    id?: number = undefined
    @JsonProperty("title", Document, true)
    image?: Document = undefined
    @JsonProperty("title", String, true)
    title?: string = undefined
    @JsonProperty("body", String, true)
    body?: string = undefined

}