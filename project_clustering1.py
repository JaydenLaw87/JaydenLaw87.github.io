# -*- coding: utf-8 -*-
"""Project_Clustering1.ipynb

Automatically generated by Colaboratory.

Original file is located at
    https://colab.research.google.com/drive/1Tq4ATkZiRqNFebcfVI4UcSw6-N8zhf6M
"""

# Commented out IPython magic to ensure Python compatibility.
!pip install yfinance
!pip install dtaidistance

# %matplotlib inline
import matplotlib.pyplot as plt
import seaborn as sns; sns.set()
import numpy as np
import pandas as pd
import yfinance as yf
import scipy.cluster.hierarchy as sch
from dtaidistance import dtw
from dtaidistance import dtw_visualisation as dtwvis
from dtaidistance import clustering

dfs=[]
for x in ['GS','JPM','MS','4M4.DU','HLI','SF','LAZ','EVR','MC']:
  df = yf.Ticker(x).history(period='5y')
  df=df[['Close']]
  df['Name']=x
  dfs.append(df)

dfs[3] = dfs[3].replace('4M4.DU','MAC')

pd.concat(dfs)

dfz=pd.DataFrame()
for x in dfs:
  stock_name=x['Name'].values[0]
  stock_name=stock_name.replace('.','')
  x=x[['Close']]
  x.index=x.index.astype(str).str[:10]
  x.columns=[stock_name]
  dfz=x.join(dfz)

dfz.to_csv('M&A_Banks.csv')

stocks=pd.read_csv('M&A_Banks.csv').dropna()
for x in stocks.columns[1:10]:
  stocks[x+'_z_norm']= (stocks[x] - stocks[x].mean())/stocks[x].std()
stock_stack=stocks.set_index('Date').stack().reset_index()
stock_stack.columns=['Date','Stock','Value']
stock_stack['Date']=pd.to_datetime(stock_stack['Date'])
stock_stack=stock_stack[stock_stack['Stock'].str.contains('z_norm')]
stock_stack.head()

timeSeries=stock_stack.set_index(['Date','Stock']).unstack()['Value']
timeSeries.columns=[i[:9] for i in timeSeries.columns]

model = clustering.LinkageTree(dtw.distance_matrix_fast, {})
cluster_idx = model.fit(np.array(timeSeries.T))

fig, ax = plt.subplots(nrows=1, ncols=2, figsize=(10, 10))
model.plot(axes=ax, show_ts_label=timeSeries.columns,
           show_tr_label=True, ts_label_margin=-10,
           ts_left_margin=10, ts_sample_length=1)