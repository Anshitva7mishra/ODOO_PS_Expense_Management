import React, { useEffect, useState } from 'react';
import { useCompany } from '../../contexts/CompanyContext';
import { BuildingIcon, SaveIcon } from 'lucide-react';
const CompanySettings: React.FC = () => {
  const {
    company,
    currencies,
    updateCompany,
    loading
  } = useCompany();
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState('');
  const [country, setCountry] = useState('');
  const [countries, setCountries] = useState<{
    name: string;
    code: string;
  }[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  useEffect(() => {
    if (company) {
      setName(company.name);
      setCurrency(company.currency);
      setCountry(company.country);
    }
  }, [company]);
  useEffect(() => {
    // Mock country data - in a real app this would come from the API
    setCountries([{
      name: 'United States',
      code: 'US'
    }, {
      name: 'United Kingdom',
      code: 'GB'
    }, {
      name: 'Canada',
      code: 'CA'
    }, {
      name: 'Australia',
      code: 'AU'
    }, {
      name: 'Germany',
      code: 'DE'
    }, {
      name: 'France',
      code: 'FR'
    }, {
      name: 'Japan',
      code: 'JP'
    }, {
      name: 'China',
      code: 'CN'
    }, {
      name: 'India',
      code: 'IN'
    }, {
      name: 'Brazil',
      code: 'BR'
    }]);
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateCompany({
        name,
        currency,
        country
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error('Failed to update company settings:', err);
    }
  };
  if (!company) {
    return <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-2 text-gray-500">Loading company information...</p>
      </div>;
  }
  return <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Company Settings</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your company information and preferences
        </p>
      </div>
      <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center">
            <BuildingIcon className="h-5 w-5 text-gray-400 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">
              Company Information
            </h2>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="company-name" className="block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <input type="text" id="company-name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <select id="country" value={country} onChange={e => setCountry(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option value="">Select a country</option>
                {countries.map(c => <option key={c.code} value={c.name}>
                    {c.name}
                  </option>)}
              </select>
            </div>
            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                Base Currency
              </label>
              <select id="currency" value={currency} onChange={e => setCurrency(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option value="">Select a currency</option>
                {currencies.map(curr => <option key={curr.code} value={curr.code}>
                    {curr.name} ({curr.code})
                  </option>)}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                This is the currency in which all expenses will be converted and
                stored.
              </p>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end">
            {isSaved && <span className="mr-3 text-sm text-green-600">
                Settings saved successfully!
              </span>}
            <button type="submit" disabled={loading} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400">
              {loading ? <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </> : <>
                  <SaveIcon className="mr-2 h-4 w-4" />
                  Save Changes
                </>}
            </button>
          </div>
        </form>
      </div>
    </div>;
};
export default CompanySettings;