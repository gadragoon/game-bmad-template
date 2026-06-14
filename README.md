# Game BMAD Template

A comprehensive template for board game analysis and design using the BMAD (Board Game Mechanic Analysis and Design) framework.

## 📊 Language Composition

This project uses multiple languages to provide a complete solution:

- **Python** 78.8% - Core game analysis and simulation engine
- **HTML** 17.5% - Report generation and web-based visualization
- **JavaScript** 2.7% - Interactive frontend components
- **Other** 1% - Configuration and documentation files

## 📋 Project Structure

```
game-bmad-template/
├── README.md                           # This file
├── .github/
│   └── workflows/                      # CI/CD workflows
├── data/
│   ├── raw/                           # Raw game data
│   ├── processed/                      # Processed game data
│   └── external/                       # External datasets
├── src/
│   ├── main/
│   │   ├── __init__.py
│   │   ├── analysis/                  # Game analysis modules (Python)
│   │   │   ├── __init__.py
│   │   │   ├── mechanics.py           # Mechanic analysis
│   │   │   ├── balancing.py           # Balance analysis
│   │   │   ├── narrative.py           # Story/narrative analysis
│   │   │   ├── player_interaction.py  # Player interaction analysis
│   │   │   └── emergence.py           # Emergence pattern analysis
│   │   ├── models/                    # Game models and representations (Python)
│   │   │   ├── __init__.py
│   │   │   ├── game.py                # Base game model
│   │   │   ├── components.py          # Game components
│   │   │   ├── rules.py               # Rule engine
│   │   │   ├── state.py               # Game state management
│   │   │   └── actions.py             # Game actions
│   │   ├── simulation/                # Game simulation engine (Python)
│   │   │   ├── __init__.py
│   │   │   ├── simulator.py           # Main simulator
│   │   │   ├── ai_players.py          # AI player implementations
│   │   │   ├── strategies.py          # Strategy implementations
│   │   │   └── metrics.py             # Simulation metrics
│   │   ├── visualization/             # Visualization components (Python + JavaScript)
│   │   │   ├── __init__.py
│   │   │   ├── board_viz.py           # Board visualization (Python)
│   │   │   ├── charts.py              # Analytics charts (Python)
│   │   │   ├── network_viz.js         # Network diagrams (JavaScript)
│   │   │   └── timeline_viz.js        # Timeline visualization (JavaScript)
│   │   ├── reporting/                 # Report generation (Python + HTML)
│   │   │   ├── __init__.py
│   │   │   ├── report_generator.py    # Report generation engine (Python)
│   │   │   ├── templates/             # Report templates (HTML)
│   │   │   │   ├── base_template.html
│   │   │   │   ├── analysis_report.html
│   │   │   │   ├── mechanics_report.html
│   │   │   │   ├── balance_report.html
│   │   │   │   └── simulation_report.html
│   │   │   └── exporters.py           # Export functionality (Python)
│   │   ├── static/                    # Static web assets
│   │   │   ├── css/                   # Stylesheets
│   │   │   ├── js/                    # JavaScript modules
│   │   │   └── images/                # Images and assets
│   │   └── utils/                     # Utility functions (Python)
│   │       ├── __init__.py
│   │       ├── helpers.py
│   │       ├── validators.py
│   │       └── converters.py
│   └── test/
│       ├── __init__.py
│       ├── unit/                      # Unit tests (Python)
│       ├── integration/               # Integration tests (Python)
│       └── fixtures/                  # Test fixtures
├── notebooks/
│   ├── analysis_template.ipynb        # Analysis template notebook (Python)
│   ├── prototype_testing.ipynb        # Prototype testing notebook (Python)
│   ├── mechanic_exploration.ipynb     # Mechanic exploration (Python)
│   └── balancing_guide.ipynb          # Balancing guide (Python)
├── docs/
│   ├── api/                           # API documentation
│   ├── guides/                        # User guides
│   │   ├── getting_started.md
│   │   ├── game_design_workflow.md
│   │   ├── analysis_guide.md
│   │   ├── simulation_guide.md
│   │   ├── visualization_guide.md
│   │   └── troubleshooting.md
│   └── examples/                      # Example implementations
│       ├── simple_game.md
│       ├── complex_game.md
│       └── custom_mechanics.md
├── config/
│   ├── default.yaml                   # Default configuration
│   ├── analysis.yaml                  # Analysis settings
│   ├── simulation.yaml                # Simulation settings
│   └── reporting.yaml                 # Reporting settings
├── samples/
│   ├── games/                         # Sample game definitions
│   ├── analyses/                      # Sample analysis results
│   └── reports/                       # Sample reports (HTML)
├── requirements.txt                   # Python dependencies
├── setup.py                           # Package setup
├── package.json                       # JavaScript dependencies (if using Node.js)
├── .gitignore                         # Git ignore rules
└── LICENSE                            # License file

```

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- pip or conda
- (Optional) Node.js 14+ for JavaScript frontend components

### Installation

1. Clone the repository:
```bash
git clone https://github.com/gadragoon/game-bmad-template.git
cd game-bmad-template
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. (Optional) Install JavaScript dependencies:
```bash
npm install
```

4. Set up the package:
```bash
python setup.py develop
```

## 📚 Core Components

### Analysis Module (`src/main/analysis/`) - Python
- **mechanics.py**: Analyze game mechanics and their interactions
- **balancing.py**: Evaluate game balance and fairness
- **narrative.py**: Analyze story elements and narrative structure
- **player_interaction.py**: Study player interactions and social mechanics
- **emergence.py**: Identify emergent patterns and properties

### Models Module (`src/main/models/`) - Python
- **game.py**: Core game model representation
- **components.py**: Game components (pieces, cards, tokens, etc.)
- **rules.py**: Rule engine for enforcing game rules
- **state.py**: Game state tracking and management
- **actions.py**: Define and execute game actions

### Simulation Module (`src/main/simulation/`) - Python
- **simulator.py**: Main simulation engine
- **ai_players.py**: AI player implementations
- **strategies.py**: Various player strategies
- **metrics.py**: Collect and analyze simulation metrics

### Visualization Module (`src/main/visualization/`) - Python + JavaScript
- **board_viz.py**: Visualize game board state (Python backend)
- **charts.py**: Create analysis charts and graphs (Python backend)
- **network_viz.js**: Visualize game mechanics networks (JavaScript frontend)
- **timeline_viz.js**: Show temporal aspects of gameplay (JavaScript frontend)

### Reporting Module (`src/main/reporting/`) - Python + HTML
- **report_generator.py**: Generate comprehensive analysis reports (Python)
- **templates/**: HTML-based report templates
- **exporters.py**: Export results in multiple formats (PDF, HTML, JSON)

## 🎮 Usage Examples

### Basic Game Definition

```python
from src.main.models.game import Game
from src.main.models.components import Component

# Create a game
game = Game(name="My Game", players=2)

# Add components
game.add_component(Component("dice", quantity=2))
game.add_component(Component("tokens", quantity=10))
```

### Running Analysis

```python
from src.main.analysis.mechanics import MechanicsAnalyzer

analyzer = MechanicsAnalyzer(game)
results = analyzer.analyze()
print(results.summary())
```

### Game Simulation

```python
from src.main.simulation.simulator import GameSimulator

simulator = GameSimulator(game)
results = simulator.run_simulations(num_games=100)
print(results.statistics())
```

### Generating Reports

```python
from src.main.reporting.report_generator import ReportGenerator

generator = ReportGenerator(analysis_results=results)
html_report = generator.generate_html_report()
generator.export_to_file("analysis_report.html")
```

## 📖 Documentation

- [Getting Started Guide](docs/guides/getting_started.md)
- [Game Design Workflow](docs/guides/game_design_workflow.md)
- [Analysis Guide](docs/guides/analysis_guide.md)
- [Simulation Guide](docs/guides/simulation_guide.md)
- [Visualization Guide](docs/guides/visualization_guide.md)
- [API Documentation](docs/api/)

## 🧪 Testing

Run the test suite:

```bash
# All tests
pytest

# Specific test file
pytest src/test/unit/test_models.py

# With coverage
pytest --cov=src/main
```

## 🔧 Configuration

Configuration files are located in the `config/` directory:

- `default.yaml`: Default application settings
- `analysis.yaml`: Analysis-specific settings
- `simulation.yaml`: Simulation parameters
- `reporting.yaml`: Report generation settings

## 📊 Sample Data and Reports

The `samples/` directory contains:
- Example game definitions in `games/`
- Sample analysis results in `analyses/`
- Generated reports in `reports/`

## 🏗️ Technology Stack

### Backend (Python - 78.8%)
- Core game modeling and analysis
- Simulation engine with AI players
- Data processing and metrics calculation
- Report generation

### Frontend (HTML + JavaScript - 20.2%)
- Interactive report generation (HTML templates)
- Browser-based visualizations (JavaScript)
- Dynamic charts and diagrams
- User-friendly dashboards

### Configuration & Documentation (Other - 1%)
- YAML configuration files
- Markdown documentation
- Build configuration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💡 Key Features

✅ **Comprehensive Game Modeling** - Define games with detailed component and rule systems
✅ **Mechanic Analysis** - Analyze game mechanics and their interactions
✅ **Balance Evaluation** - Assess game fairness and balance
✅ **AI Simulation** - Run simulations with AI players
✅ **Rich Visualization** - Create visual representations of game analysis
✅ **Report Generation** - Generate professional analysis reports with HTML templates
✅ **Interactive Frontend** - JavaScript-powered interactive dashboards
✅ **Extensible Architecture** - Easy to extend with custom analysis and mechanics

## 🎯 Project Goals

1. Provide a structured framework for board game design and analysis
2. Enable data-driven decision-making in game development
3. Support iterative game balancing and refinement
4. Facilitate collaboration through standardized formats
5. Generate actionable insights for game designers
6. Create visually appealing, interactive reports and dashboards

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Happy game designing!** 🎲
