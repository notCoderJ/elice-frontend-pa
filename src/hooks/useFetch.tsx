import { useCallback, useState, useRef, useEffect } from 'react';
import axios, { CancelTokenSource } from 'axios';
import api from '../api';
import { Nullable } from '../interface/common';

export interface OptionsType {
  filterConditions?: string;
  offset?: number;
}

export interface CourseDataType {
  enroll_type: number;
  title: string;
  short_description: string;
  logo_file_url: Nullable<string>;
  is_free: boolean;
}

export interface ResponseDataType {
  course_count: number;
  courses: CourseDataType[];
}

export interface FetchReturnType {
  isLoading: boolean;
  data: Nullable<ResponseDataType>;
  error: Nullable<string>;
}

interface FetchHookType {
  (url: string, options?: OptionsType): FetchReturnType;
}

const useFetch: FetchHookType = (url, options) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Nullable<ResponseDataType>>(null);
  const [error, setError] = useState<Nullable<string>>(null);
  const source = useRef<Nullable<CancelTokenSource>>(null);

  const cancel = useCallback(() => {
    if (source.current !== null) {
      source.current.cancel();
      source.current = null;
    }
  }, []);

  useEffect(() => {
    if (!options) {
      return;
    }

    (async () => {
      try {
        setIsLoading(true);
        setError(null);
        cancel();
        source.current = axios.CancelToken.source();
        const res = await api.get(url, {
          cancelToken: source.current.token,
          params: {
            filter_conditions: options?.filterConditions || '',
            offset: (options?.offset || 0) * 20,
            count: 20,
          },
        });
        const { _result, ...resData } = res.data;
        if (_result.status !== 'ok') {
          throw new Error(resData.fail_message);
        }
        setData(resData);
      } catch (err) {
        setError(err as string);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [url, options, cancel]);

  useEffect(() => {
    return cancel;
  }, [cancel]);

  return { isLoading, data, error };
};

export default useFetch;
