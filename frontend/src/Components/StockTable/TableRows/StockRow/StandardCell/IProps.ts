import IStock from "Interfaces/IStock";

export default interface IStandardCellProps {
    stock: IStock, 
    Property: keyof IStock, 
    indProperty: number, 
    indStock: number
}