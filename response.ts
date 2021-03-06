import { ServerRequest } from "https://deno.land/std@0.81.0/http/server.ts";
import { lookup } from "https://deno.land/x/media_types/mod.ts";



import { exists, existsSync } from "https://deno.land/std@0.81.0/fs/exists.ts";
export default class Response{
    private req : ServerRequest
    private headers = new Headers
    private code = 200 
    constructor(req : ServerRequest){
        this.req = req
    }

    header(name : string, value : string){
        this.headers.set(name, value)
        return this
    }

    status(code : number){this.code=code;return this}

    end(data : any){
        this.req.respond({
            body : `${data}`,
            headers : this.headers,
            status : this.code
        })
    }

    sendFile(path : string){
            var mimeType = lookup(path)
            
            if(existsSync(path)){
                this.header('Content-Type', mimeType || 'text/plain')
                this.req.respond({
                    body : Deno.readFileSync(path),
                    headers : this.headers,
                    status : this.code,
                })
            }
            else{
                this.req.respond({
                    body : `Error: File ${path || 'null'} not found`,
                    headers : this.headers,
                    status : this.code,
                })
            }  
    }

    json(data : any){
        this.req.respond({
            body : JSON.stringify(data),
            headers : this.headers,
            status : this.code,
        })
    }

    
}