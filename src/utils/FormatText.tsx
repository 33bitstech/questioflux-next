export const cleanString = (str: string) : string =>{
    return str.split(' ').filter(w=>w!=='').join(' ')
}
export const validEmail = (email:string) : RegExpMatchArray | null =>{
    return email.match(/^[\w\d.!#$%&'+/=?^_`{|}~-]+@[\w\d-]+(?:.[\w\d-]+)+$/)
}