import pandas as pd

_df = pd.read_csv("market-price.csv")

def calc_MDD(_inputdf):
  myseries = _inputdf["market-price"]
  df = myseries.to_frame(name='nw')

  max_peaks_idx = df.nw.expanding(min_periods=1).apply(lambda x: x.argmax()).fillna(0).astype(int)
  df['max_peaks_idx'] = pd.Series(max_peaks_idx).to_frame()

  nw_peaks = pd.Series(df.nw.iloc[max_peaks_idx.values].values, index=df.nw.index)

  df['dd'] = ((df.nw-nw_peaks)/nw_peaks)
  df['mdd'] = df.groupby('max_peaks_idx').dd.apply(lambda x: x.expanding(min_periods=1).apply(lambda y: y.min())).fillna(0)

  return df

df = calc_MDD(_df)

df.to_csv('out', sep=',', encoding='utf-8')