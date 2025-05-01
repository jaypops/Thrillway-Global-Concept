import { useState } from "react";
import EditProperty from "./EditProperty";

function Columns() {
  const [editingProperty, setEditingProperty] = useState(null) ;
  return (
    <div>
      {editingProperty && (
        <EditProperty
          propertyId={editingProperty}
          onClose={() => setEditingProperty(null)}
        />
      )}
    </div>
  );
}

export default Columns;
