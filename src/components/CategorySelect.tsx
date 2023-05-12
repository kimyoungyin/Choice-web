type selectedId = number | null;

interface CategorySelectProps {
    categories: global.Category[];
    selectedId: selectedId;
    onChange: (selectedId: selectedId) => void;
}

const CategorySelect = ({
    categories,
    selectedId,
    onChange,
}: CategorySelectProps) => {
    const categoryClickHandler = (id: number) => {
        if (selectedId === id) {
            onChange(null);
        } else {
            onChange(id);
        }
    };

    return (
        <div className="Home-categoryList">
            {categories.map((categoryObj) => (
                <button
                    className={`Home-categoryBtn ${
                        categoryObj.id === selectedId ? "active" : ""
                    }`}
                    key={categoryObj.id}
                    onClick={() => categoryClickHandler(categoryObj.id)}
                >
                    {categoryObj.name}
                </button>
            ))}
        </div>
    );
};

export default CategorySelect;
