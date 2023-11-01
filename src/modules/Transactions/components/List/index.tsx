import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { createStyles, withStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { getNetwork } from '@/utils/helper';
import Loading from '@/common/Loading';
import ListView from '@/common/View/ListView';
import Pagination from '@/common/View/Pagination';
import CenteredView from '@/common/View/CenteredView';
import TransactionTable from '../Table';
import { withRouter,RoutedProps } from '@/utils/withRouter';

const useStyles = (theme: any) => createStyles({
  pagerArea: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'flex-end',
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : undefined,
    color: theme.palette.getContrastText(theme.palette.background.paper),
  },
});

interface ExternalProps {
  className?: string,
}

interface InternalProps {
  transactionList: any,
  isLoadingMore: boolean,
  getTransactionList: (contents: any, callback?: any) => any,
  classes: any,
  t: any,
}

interface Props extends ExternalProps, InternalProps,RoutedProps {
}

interface IndexState {
  currentPage: number;
  selectedRecords: Array<unknown>
}

class Index extends PureComponent<Props, IndexState> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    transactionList: null,
    isLoadingMore: undefined,
    getTransactionList: () => {
    },
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      currentPage: 1,
      selectedRecords: [],
    };
  }
  


  componentDidMount() {
    console.log('componentDidMount');
    const params = this.props.params;
    if(Number(params.page)){
      this.fetchListPage(Number(params.page));
    }else{
      this.fetchListPage(this.state.currentPage);
    }
  }

  fetchListPage = (page: number) => {
    this.props.getTransactionList({ page },()=>{
      this.setState({
        currentPage:page,
        selectedRecords: []
      });

    });
  };

  pagination = (type: string) => {
    // transactions use timestamp as sort filed, so we can not jump to specific page
    // const hits = this.props.transactionList ? this.props.transactionList.contents : [];
    // const last = hits[hits.length - 1];
    // const after = last && last.sort || 0;
    if (type === 'prev' && this.state.currentPage > 1) {
      const page = this.state.currentPage - 1;
      this.props.navigate(`/main/transactions/${page}`);
      this.fetchListPage(page);
    } else if (type === 'next') {
      const page = this.state.currentPage + 1;
      this.props.navigate(`/main/transactions/${page}`);
      this.fetchListPage(page);
    }
  };

  // TODO: 更新选中记录
  updateSelectedRecord = (transaction_hash: string,  selected: boolean)=>{
    console.log('updateSelectedRecord', transaction_hash, selected);
    this.setState((pre)=>{
      let _selectedRecords: Array<unknown> = [...pre.selectedRecords];
      if (selected) {
        _selectedRecords.push(transaction_hash)
      } else {
        _selectedRecords = pre.selectedRecords.filter((val: any)=>val !== transaction_hash);
      }
      return {...pre,  selectedRecords: _selectedRecords}
    })
  }

  // TODO:下载
  upload = ()=>{
    console.log('upload', this.state.selectedRecords);
    if (this.state.selectedRecords.length) {
      this.state.selectedRecords.forEach(transaction_hash=>{
        const a = document.createElement('a');
        console.log(`/${getNetwork()}/transactions/detail/${transaction_hash}`);
        // a.href = `${location.host}/main${getNetwork()}/transactions/detail/${transaction_hash}`;
        a.href = `/${getNetwork()}/transactions/detail/${transaction_hash}`;
        console.log('a.href', a.href);
        // a.download = transaction_hash; // `${transaction_hash}.csv`;
        a.setAttribute('download', transaction_hash);
        a.click();
      })
    } else {
      alert('请至少选择一条记录后再下载');
    }
  }

  render() {
    console.log('List this.props', this.props);
    const { transactionList, isLoadingMore, className, classes, t } = this.props;
    const isInitialLoad = !transactionList;
    const transactions = transactionList && transactionList.contents || [];
    const transactionsList = transactions.length ? (
      <TransactionTable
        selectedRecords={this.state.selectedRecords}
        transactions={transactions}
        updateSelectedRecord={this.updateSelectedRecord}
      />
    ) : (
      <CenteredView>
        <div className={classes.header}>
          <Typography variant='h5' gutterBottom className={classes.title}>
            {t('transaction.NoTransactionData')}
          </Typography>
        </div>
      </CenteredView>
    );
    return (
      <div>
        <Helmet>
          <title>{t('header.transactions')}</title>
        </Helmet>
        <ListView
          className={className}
          title={t('header.transactions')}
          name={t('header.transactions')}
          pluralName={t('header.transactions')}
          content={
            <div>
              {isInitialLoad ? <Loading /> : transactionsList}
              <div className={classes.pagerArea}>
                {/* 分页条 */}
                <Button onClick={ this.upload }>批量下载</Button>
                <Pagination
                  page={this.state.currentPage}
                  pageSize={20}
                  currentPageSize={transactions == null ? null : transactions.length}
                  hasPreviousPage={this.state.currentPage > 1}
                  hasNextPage={!!true}
                  onPrevPage={() => this.pagination('prev')}
                  onNextPage={() => this.pagination('next')}
                  isLoading={isLoadingMore}
                />
              </div>
            </div>
          }
        />
      </div>
    );
  }
}

export default withStyles(useStyles)(withTranslation()(withRouter(Index)));
