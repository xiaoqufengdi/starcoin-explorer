import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import TransactionSummary from '../TransactionSummary';

interface ExternalProps {
  transactions: any,
  className?: string,
  selectedRecords: Array<unknown>,
  updateSelectedRecord: (transaction_hash: string,  selected: boolean)=>any,
}

interface InternalProps {
}

interface Props extends ExternalProps, InternalProps {
}

class Index extends React.PureComponent<Props> {
  render() {
    const { transactions, className, selectedRecords, updateSelectedRecord } = this.props;
    console.log('selectedRecords, updateSelectedRecord');
    return (
      <div className={className} id='my111'>
        {
          transactions.map((transaction: any) => (
            <div style={{display: 'flex'}}>
              <Checkbox key={transaction._id || transaction.transaction_hash}
                        checked={selectedRecords.includes(transaction.transaction_hash)}
                        onChange={(event: object)=>{
                          console.log('onChange', event);
                          updateSelectedRecord(transaction.transaction_hash, event.target?.checked)
                        }}
              />
              <TransactionSummary
                key={transaction._id || transaction.transaction_hash}
                transaction={transaction}
              />
              </div>))
            }
      </div>
    );
  }
}

export default Index;
