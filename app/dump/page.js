
import fetchWithAuth from '@/utils/fetchWithAuth';
import PageTitle from '@/components/PageTitle';




export default async function Dump() {
  const fetchData = async () => {
    //await new Promise((resolve) => setTimeout(resolve, 2000)); // Artificial delay
    const items = await fetchWithAuth('/dump');
    return items;
  };

  const items = await fetchData();

  return (
      <PageTitle title=" الإجراءات الإدارية ">
      <ul className="grid grid-cols-2 gap-4">
        {items.map((item) => (
          <li key={item.id} className=" bg-slate-500">
            <h3 className="text-lg font-bold">{item.name}</h3>
            <p>
              <strong>English Name:</strong> {item.english}
            </p>
            <p>
              <strong>National ID:</strong> {item.national_id}
            </p>
            <p>
              <strong>Birth Date:</strong> {item.birth_date || 'N/A'}
            </p>
            <p>
              <strong>Gender:</strong> {item.gender === 1 ? 'Male' : item.gender === 2 ? 'Female' : 'Unknown'}
            </p>
            <p>
              <strong>Student ID:</strong> {item.student_id}
            </p>
          </li>
        ))}
      </ul>
      </PageTitle>
  );
}
