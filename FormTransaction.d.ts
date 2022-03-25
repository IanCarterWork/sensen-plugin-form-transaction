

declare type TFormTransactionsElements = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

declare type TFormTransactionsRecords = {

    [name: string] : TFormTransactionsElements | TFormTransactionsElements[]
    
}


declare type TFormTransactionsResults = {

    [name: string] : any
    
}


