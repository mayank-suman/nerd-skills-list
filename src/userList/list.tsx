import { useEffect, useState } from "react";

const allUsersEP =
  "https://cap-int-api.herokuapp.com/api/nerds/list?apiKey=nerds_allowed_only";

const searchEP =
  "https://cap-int-api.herokuapp.com/api/nerds/search?apiKey=nerds_allowed_only";

const getCorrectEP = (isSearchEnabled: boolean, inputValue: string): String =>
  isSearchEnabled ? `${searchEP}&keyword=${inputValue}` : allUsersEP;

interface UserDataStructure {
  id: number;
  name?: string;
  languages?: String[] | null;
  fullName?: string;
  languageCombination?: String | null;
}

type User = {
  data: UserDataStructure;
  totalCount: number;
};

const factoryUsers = (data: UserDataStructure[], isSearch: Boolean = false) =>
  data.map(({ id, fullName, languageCombination, name, languages }) => ({
    id,
    name: isSearch ? fullName : name,
    languages: isSearch
      ? languageCombination?.split("|").join(", ") || "N/A"
      : languages?.join(", ") || "N/A"
  }));

function List() {
  const [users, updateUsers] = useState<UserDataStructure[]>([]);
  const [inputValue, updateInputValue] = useState("");

  useEffect(() => {
    async function udpateUsers(): Promise<void> {
      const isSearchEnabled = !!inputValue;
      const EP = getCorrectEP(isSearchEnabled, inputValue);
      let userRes: any = await fetch(EP);
      userRes = await userRes.json();
      const data = factoryUsers(userRes.data, isSearchEnabled);

      updateUsers(data);
    }

    try {
      udpateUsers();
    } catch (error) {
      console.error("error", error);
      updateUsers([]);
    }
  }, [inputValue]);

  const handleInputChange = (e) => {
    console.log(e.target.value);
    updateInputValue(e.target.value);
  };

  return (
    <>
      <input type="text" value={inputValue} onChange={handleInputChange} />
      <ul>
        {users.map(({ name, languages }) => (
          <li key={name}>
            {name} - {languages}
          </li>
        ))}
      </ul>
    </>
  );
}

export default List;
