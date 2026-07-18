import { fruitNames, fruitComponents } from '../assets/fruits'
import { animalNames, animalComponents } from '../assets/animals'
import { villainPortraits } from '../assets/portraits/fantasyvillains'
import { VisualSelection } from '../components/VisualSelection.tsx'

function AssetsPage() {
    return (
        <div style={{ padding: 24 }}>
            <h2>Visual Selection</h2>
            <div style={{ marginBottom: 32 }}>
                <p style={{ marginBottom: 8, fontWeight: 'bold' }}>Simple (lightbox)</p>
                <div style={{ height: 700, position: 'relative' }}>
                    <VisualSelection
                        images={[]}
                        selected={villainPortraits[3]}
                        simple
                        onComplete={() => console.log('simple complete')}
                    />
                </div>
            </div>

            {[2,3,4,5,6,7,8,9,10].map(count => (
                <div key={count} style={{ marginBottom: 32 }}>
                    <p style={{ marginBottom: 8, fontWeight: 'bold' }}>Count: {count}</p>
                    <div style={{ height: 700, position: 'relative' }}>
                        <VisualSelection
                            images={villainPortraits.slice(0, count)}
                            selected={villainPortraits[0]}
                            minCount={count}
                            onComplete={() => console.log('complete')}
                        />
                    </div>
                </div>
            ))}

            <h2 style={{ marginTop: 40 }}>Fruits</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                {fruitNames.map(name => {
                    const Fruit = fruitComponents[name]
                    return (
                        <div key={name} style={{ textAlign: 'center' }}>
                            <Fruit width={60} height={60} />
                            <div style={{ fontSize: 11, marginTop: 4 }}>{name}</div>
                        </div>
                    )
                })}
            </div>

            <h2 style={{ marginTop: 40 }}>Animals</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
                {animalNames.map(name => {
                    const Animal = animalComponents[name]
                    return (
                        <div key={name} style={{ textAlign: 'center' }}>
                            <Animal width={72} height={72} />
                            <div style={{ fontSize: 11, marginTop: 4 }}>{name}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default AssetsPage
