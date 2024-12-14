export interface SharedTableData {
    cols?: string[];
    actions?: SharedTableDataFunc[];
  }
  
  export interface SharedTableDataFunc {
    icon: string;
    func: CallableFunction;
    arg: string | object | undefined;
    tooltip?: string;
  }
  